import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

export class CryptoUtil {
  public static hash(str: string, algorithm = 'sha256'): string {
    const res = createHash(algorithm).update(str).digest('hex')
    return res
  }

  public static encrypt(str: string, secret: string): string {
    const key = createHash('sha256').update(secret).digest()
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    const result = Buffer.concat([iv, authTag, encrypted]).toString('base64url')
    return result
  }

  public static decrypt(str: string, secret: string): string {
    const key = createHash('sha256').update(secret).digest()
    const buffer = Buffer.from(str, 'base64url')
    const iv = buffer.subarray(0, 12)
    const authTag = buffer.subarray(12, 28)
    const encrypted = buffer.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
    return result
  }
}
