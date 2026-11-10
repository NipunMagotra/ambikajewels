import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { recordAuditLog } from '@/lib/auditLog';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates actual binary magic bytes of the image file to prevent polyglots,
 * MIME-type spoofing, and HTML/SVG disguised as images.
 */
function detectImageFormatFromBuffer(buf: Buffer): { ext: string; mime: string } | null {
  if (buf.length < 3) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // GIF: GIF87a or GIF89a (at least 6 bytes)
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) &&
    buf[5] === 0x61
  ) {
    return { ext: 'gif', mime: 'image/gif' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A (at least 8 bytes)
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11) (at least 12 bytes)
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  // AVIF: bytes 4-11 contains ftypavif, ftypavis, or ftypmif1 (at least 12 bytes)
  if (buf.length >= 12) {
    const brand = buf.subarray(4, 12).toString('ascii');
    if (brand.startsWith('ftyp') && (brand.includes('avif') || brand.includes('avis') || brand.includes('mif1'))) {
      return { ext: 'avif', mime: 'image/avif' };
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type: ${file.type}. Please upload a JPEG, PNG, WebP, or AVIF image.`
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Image size exceeds maximum limit of 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cryptographic Magic Bytes Inspection — eliminates spoofed headers and embedded scripts
    const verifiedFormat = detectImageFormatFromBuffer(buffer);
    if (!verifiedFormat) {
      return NextResponse.json(
        {
          success: false,
          message: 'Binary inspection failed: uploaded file is corrupted or not a valid image.'
        },
        { status: 400 }
      );
    }

    // Deep Image Validation & Re-encoding via Sharp
    // Decodes raster stream, strips EXIF/GPS, verifies pixel dimensions, and re-encodes pure WebP
    let processedBuffer: Buffer = buffer;
    const finalExt = 'webp';
    const finalMime = 'image/webp';

    try {
      const sharp = (await import('sharp')).default;
      const img = sharp(buffer);
      const meta = await img.metadata();

      // Corrupt or unparseable image rejection
      if (!meta.width || !meta.height) {
        return NextResponse.json(
          { success: false, message: 'Image decoding failed: malformed or corrupt raster dimensions.' },
          { status: 400 }
        );
      }

      // Decompression bomb / excessive dimension defense (max 4096 x 4096)
      if (meta.width > 4096 || meta.height > 4096) {
        return NextResponse.json(
          {
            success: false,
            message: `Image dimensions (${meta.width}x${meta.height}) exceed the 4096x4096px maximum security threshold.`
          },
          { status: 400 }
        );
      }

      // Safe re-encode: strips all EXIF/GPS/comments and produces pure sanitized WebP
      processedBuffer = await img
        .rotate() // auto-orient and strip orientation EXIF
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Image processing failed: corrupt or unparseable image file.'
        },
        { status: 400 }
      );
    }

    const cleanBase = (file.name || 'image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 30);
    const fileName = `${cleanBase}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${finalExt}`;
    const filePath = `catalog/${fileName}`;

    let publicUrl = '';

    // 1. Try Supabase Storage
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { error: uploadError } = await supabaseAdmin.storage
          .from('products')
          .upload(filePath, processedBuffer, {
            contentType: finalMime,
            upsert: false
          });

        if (!uploadError) {
          const { data: publicData } = supabaseAdmin.storage
            .from('products')
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            publicUrl = publicData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn('[STORAGE UPLOAD WARN]', storageErr);
      }
    }

    // 2. Fallback to saving to public/uploads directory if Supabase Storage is not active
    if (!publicUrl) {
      try {
        const publicDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(publicDir, { recursive: true });
        const localFilePath = path.join(publicDir, fileName);
        await fs.writeFile(localFilePath, processedBuffer);
        publicUrl = `/uploads/${fileName}`;
      } catch {
        // Last-resort fallback to data URL
        const base64 = processedBuffer.toString('base64');
        publicUrl = `data:${finalMime};base64,${base64}`;
      }
    }

    await recordAuditLog({
      action: 'IMAGE_UPLOADED',
      entityType: 'product',
      newValues: { fileName, publicUrl, sizeBytes: file.size },
      request
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

