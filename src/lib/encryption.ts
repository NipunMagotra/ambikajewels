import crypto from 'crypto';

// Secret key for AES-256 encryption. Requires ENCRYPTION_SECRET or RAZORPAY_KEY_SECRET.
const getEncryptionKey = (): Buffer => {
  const secret = process.env.ENCRYPTION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('[SECURITY FATAL] Missing ENCRYPTION_SECRET or RAZORPAY_KEY_SECRET in environment variables. Cannot initialize AES-256 cryptographic module.');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts sensitive information (such as customer PAN) using AES-256-GCM.
 */
export function encryptSensitiveData(plainText: string): string {
  if (!plainText) return '';
  try {
    const iv = crypto.randomBytes(12);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plainText.trim().toUpperCase(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Encryption error:', err);
    return '';
  }
}

/**
 * Decrypts sensitive information.
 */
export function decryptSensitiveData(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return '';
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) return '';
    
    const [ivHex, authTagHex, cipherHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
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
  if (!address) return 'Verified Shipping Destination, India';
  const parts = address.split(',').map(p => p.trim());
  
  // Hide the exact house / building number (the first segment)
  const safeParts = parts.length > 2 ? parts.slice(1) : parts;
  const maskedPincode = pincode && pincode.length === 6 ? `${pincode.slice(0, 3)}***` : '180***';
  
  return `${safeParts.join(', ')} (${maskedPincode})`;
}

/**
 * Generates an unguessable verification token for an order.
 * Allows instant authenticated access to /order-status right after checkout without re-typing phone/email.
 */
export function generateOrderAccessToken(orderId: string, phoneOrEmail: string): string {
  const secret = process.env.ENCRYPTION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('[SECURITY FATAL] Missing ENCRYPTION_SECRET or RAZORPAY_KEY_SECRET for HMAC token generation.');
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
