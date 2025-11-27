import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiForbiddenResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { API_KEY_HEADER_NAME } from '../../../constant/common.constant'
import { TokenResult } from '../dto/token-result.dto'
import { TokenOwnerGuard } from '../guard/token-owner.guard'
import { TokenGuard } from '../guard/token.guard'
import { TokenResultInterceptor } from '../interceptor/token-result.interceptor'
import { TokenService } from '../service/token.service'

@Controller('token')
@UseGuards(TokenGuard)
@ApiTags('token')
@ApiSecurity(API_KEY_HEADER_NAME)
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
export class TokenController {
  constructor(
    private readonly service: TokenService,
  ) { }

  @Post()
  @UseGuards(TokenOwnerGuard)
  @UseInterceptors(TokenResultInterceptor)
  @ApiCreatedResponse({ type: TokenResult })
  create() {
    return this.service.create()
  }
}
