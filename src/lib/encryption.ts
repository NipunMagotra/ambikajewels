import crypto from 'crypto';

// Secret key for AES-256 encryption. Exclusively requires PAN_ENCRYPTION_SECRET (or ENCRYPTION_SECRET).
// Strictly NEVER falls back to RAZORPAY_KEY_SECRET or other third-party credentials.
export const getEncryptionKey = (customSecret?: string): Buffer => {
  const secret = customSecret || process.env.PAN_ENCRYPTION_SECRET || process.env.ENCRYPTION_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error('[SECURITY FATAL] Missing or insecure PAN_ENCRYPTION_SECRET in environment variables (minimum 16 characters required). Cannot initialize AES-256 cryptographic module.');
  }
  return crypto.createHash('sha256').update(secret.trim()).digest();
};

/**
 * Encrypts sensitive information (such as customer PAN) using AES-256-GCM.
 */
export function encryptSensitiveData(plainText: string): string {
  if (!plainText) return '';
  const key = getEncryptionKey();
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plainText.trim().toUpperCase(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('[ENCRYPTION ERROR] Failed to encrypt sensitive data safely.');
    return '';
  }
}

/**
 * Decrypts sensitive information with safe key rotation / legacy support.
 */
export function decryptSensitiveData(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return '';
  const parts = encryptedData.split(':');
  if (parts.length !== 3) return '';
  
  const [ivHex, authTagHex, cipherHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const attemptDecryption = (key: Buffer): string | null => {
    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return null;
    }
  };

  try {
    const primaryKey = getEncryptionKey();
    const primaryResult = attemptDecryption(primaryKey);
    if (primaryResult !== null) {
      return primaryResult;
    }

    // Optional legacy migration key fallback (if configured during secret rotation)
    const legacySecret = process.env.PAN_ENCRYPTION_LEGACY_KEY;
    if (legacySecret && legacySecret.trim().length >= 16) {
      const legacyKey = crypto.createHash('sha256').update(legacySecret.trim()).digest();
      const legacyResult = attemptDecryption(legacyKey);
      if (legacyResult !== null) {
        return legacyResult;
      }
    }

    return '';
  } catch {
    return '';
  }
}

/**
 * Masks a PAN number for public / invoice display (e.g. "ABCDE1234F" -> "XXXXX1234X")
 */
export function maskPanNumber(pan: string): string {
  if (!pan || pan.length < 10) return 'XXXXX0000X';
  const clean = pan.trim().toUpperCase();
  return `XXXXX${clean.slice(5, 9)}X`;
}

/**
 * Masks a delivery address to protect customer privacy on unauthenticated tracking lookups.
 * (e.g. "House No. 42, Sector 1, Lower Roop Nagar, Jammu, 180013" -> "Sector 1, Lower Roop Nagar, Jammu, 180***")
 */
export function maskAddress(address: string, pincode?: string): string {
  if (!address || !address.trim()) return 'Verified Shipping Destination, India';

  let cleanPincode = (pincode || '').replace(/\D/g, '');
  if (cleanPincode.length !== 6) {
    const pinMatch = address.match(/\b\d{6}\b/);
    if (pinMatch) cleanPincode = pinMatch[0];
  }
  const maskedPincode = cleanPincode.length === 6 ? `${cleanPincode.slice(0, 3)}***` : '180***';

  const cleaned = address
    .replace(/-\s*\d{6}/g, '')
    .replace(/\b\d{6}\b/g, '')
    .trim();

  const parts = cleaned.split(',').map(p => p.trim()).filter(Boolean);

  let safeParts: string[];
  if (parts.length > 2) {
    const filtered = parts.slice(1).filter((p, idx) => {
      if (idx === 0 && /^(?:Plot|Lane|Street|Road|Building|Bldg)\s*#?\s*[\w\d-]+/i.test(p)) {
        return false;
      }
      return true;
    });
    safeParts = filtered.length >= 1 ? filtered : parts.slice(1);
  } else if (parts.length === 2) {
    safeParts = [parts[0].replace(/\d+/g, '***'), parts[1]];
  } else {
    safeParts = [parts[0].replace(/\d+/g, '***')];
  }

  if (safeParts.length > 0) {
    safeParts[0] = safeParts[0].replace(/^(?:Flat|House|Plot|Building|Bldg|Shop|Room|Unit|H\.?No\.?)\s*#?\s*[\w\d-]+/i, '***');
  }

  const result = safeParts.filter(Boolean).join(', ');
  return result ? `${result} (${maskedPincode})` : `Verified Shipping Destination, India (${maskedPincode})`;
}

/**
 * Generates an unguessable verification token for an order.
 * Allows instant authenticated access to /order-status right after checkout without re-typing phone/email.
 */
export function generateOrderAccessToken(orderId: string, phoneOrEmail: string): string {
  const secret = process.env.ORDER_TOKEN_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.PAN_ENCRYPTION_SECRET || process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('[SECURITY FATAL] Missing secret key for order access token generation.');
  }
  return crypto.createHmac('sha256', secret).update(`${orderId}:${phoneOrEmail.toLowerCase().trim()}`).digest('hex').slice(0, 32);
}

/**
 * Verifies an order access token.
 */
export function verifyOrderAccessToken(orderId: string, phoneOrEmail: string, token: string): boolean {
  if (!token || !orderId || !phoneOrEmail) return false;
  try {
    const expected = generateOrderAccessToken(orderId, phoneOrEmail);
    const bufA = Buffer.from(token);
    const bufB = Buffer.from(expected);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
