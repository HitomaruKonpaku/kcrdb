import { CryptoUtil } from './crypto.util'

export class ObjectUtil {
  public static hash(
    data: object,
    hashFields: string[],
  ) {
    const hashObj = hashFields.reduce(
      (obj, key) => {
        if (key in data) {
          Object.assign(obj, { [key]: data[key] })
        }
        return obj
      },
      {},
    )

    const hash = CryptoUtil.hash(JSON.stringify(hashObj))
    return hash
  }
}
