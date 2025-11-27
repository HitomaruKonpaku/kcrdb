import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { IncomingMessage } from 'http'
import { API_KEY_HEADER_NAME } from '../../../constant/common.constant'
import { TokenRepository } from '../repository/token.repository'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly repository: TokenRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<IncomingMessage>()
    const id = req.headers[API_KEY_HEADER_NAME] as string

    if (id) {
      const token = await this.repository.findOneBy({
        id,
        isActive: true,
      })

      if (token) {
        Object.assign(req, { _token: token })
        return true
      }
    }

    throw new UnauthorizedException()
  }
}
