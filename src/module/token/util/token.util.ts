/* eslint-disable dot-notation */

import { IncomingMessage } from 'http'
import { Token } from '../model/token.entity'

export class TokenUtil {
  public static extractRequest(req: IncomingMessage): Token | undefined {
    return req['_token']
  }
}
