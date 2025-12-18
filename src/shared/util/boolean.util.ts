export class BooleanUtil {
  public static parse(input: any): boolean | undefined {
    const dict = {
      1: true,
      0: false,
      true: true,
      false: false,
    }
    return dict[input]
  }
}
