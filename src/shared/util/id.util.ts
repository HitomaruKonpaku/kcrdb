import { nanoid } from 'nanoid'

export class IdUtil {
  public static generate(size = 11) {
    return nanoid(size)
  }
}
