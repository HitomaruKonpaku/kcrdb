import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { UseTokenGuard } from '../../../decorator/use-token-guard.decorator'
import { TokenResult } from '../dto/token-result.dto'
import { TokenOwnerGuard } from '../guard/token-owner.guard'
import { TokenResultInterceptor } from '../interceptor/token-result.interceptor'
import { TokenService } from '../service/token.service'

@Controller('tokens')
@ApiTags('token')
@UseTokenGuard()
@UseGuards(TokenOwnerGuard)
export class TokenController {
  constructor(
    private readonly service: TokenService,
  ) { }

  @Post()
  @UseInterceptors(TokenResultInterceptor)
  @ApiCreatedResponse({ type: TokenResult })
  create() {
    return this.service.create()
  }
}
