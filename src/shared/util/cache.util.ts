export class CacheUtil {
  public static key(...args: (string | number)[]) {
    return args.join(':')
  }
}
