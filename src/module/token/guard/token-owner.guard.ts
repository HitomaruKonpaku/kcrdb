import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { IncomingMessage } from 'http'
import { TokenUtil } from '../util/token.util'

@Injectable()
export class TokenOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<IncomingMessage>()
    const token = TokenUtil.extractRequest(req)

    if (token?.isOwner) {
      return true
    }

    return false
  }
}
