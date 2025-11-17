/* eslint-disable dot-notation */

export class RequestUtil {
  public static getOrigin(headers: Record<string, any>) {
    const value = headers['origin'] as string
    if (value) {
      if (value.startsWith('chrome-extension://')) {
        return 'chrome-extension://'
      }
    }
    return value
  }

  public static getXOrigin(headers: Record<string, any>) {
    const value = headers['x-origin'] || headers['data-origin']
    return value
  }

  public static getXVersion(headers: Record<string, any>) {
    const value = headers['x-version'] || headers['data-version']
    return value
  }
}
