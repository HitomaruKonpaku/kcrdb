export class ArrayUtil {
  public static parse<T>(input: any) {
    if (Array.isArray(input)) {
      return input as T[]
    }

    if (typeof input === 'string') {
      return input
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v) as T[]
    }

    return [input]
  }
}
