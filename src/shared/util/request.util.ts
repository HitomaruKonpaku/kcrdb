export class RequestUtil {
  public static getXOrigin(headers: Record<string, any>) {
    const value = headers['x-origin'] || headers['data-origin']
    return value
  }

  public static getXVersion(headers: Record<string, any>) {
    const value = headers['x-version'] || headers['data-version']
    return value
  }
}
