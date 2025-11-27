import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { IncomingMessage } from 'http'
import { Observable, tap } from 'rxjs'
import { IsNull } from 'typeorm'
import { Logger } from '../../../shared/logger'
import { TokenRepository } from '../repository/token.repository'
import { TokenUtil } from '../util/token.util'

@Injectable()
export class TokenSeenAtInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TokenSeenAtInterceptor.name)

  constructor(
    private readonly repository: TokenRepository,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const req = context.switchToHttp().getRequest<IncomingMessage>()
        const token = TokenUtil.extractRequest(req)
        if (!token) {
          return
        }

        try {
          const date = new Date()
          await this.repository.repository.update(
            { id: token.id },
            { lastSeenAt: date },
          )
          if (!token.firstSeenAt) {
            await this.repository.repository.update(
              { id: token.id, firstSeenAt: IsNull() },
              { firstSeenAt: date },
            )
          }
        } catch (error) {
          this.logger.error(error)
        }
      }),
    )
  }
}
