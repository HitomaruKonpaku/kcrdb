import { createHash } from 'crypto'

export class CryptoUtil {
  public static hash(s: string, algorithm = 'sha256'): string {
    const res = createHash(algorithm).update(s).digest('hex')
    return res
  }
}
