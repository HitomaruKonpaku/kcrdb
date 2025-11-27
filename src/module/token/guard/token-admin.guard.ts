import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { IncomingMessage } from 'http'
import { TokenUtil } from '../util/token.util'

@Injectable()
export class TokenAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<IncomingMessage>()
    const token = TokenUtil.extractRequest(req)

    if (token?.isAdmin) {
      return true
    }

    return false
  }
}
