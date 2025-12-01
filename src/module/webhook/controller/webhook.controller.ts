import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { API_KEY_HEADER_NAME } from '../../../constant/common.constant'
import { TokenOwnerGuard } from '../../token/guard/token-owner.guard'
import { TokenGuard } from '../../token/guard/token.guard'
import { WebhookCreate } from '../dto/webhook-create.dto'
import { WebhookUpdate } from '../dto/webhook-update.dto'
import { WebhookService } from '../service/webhook.service'

@Controller('webhooks')
@UseGuards(TokenGuard, TokenOwnerGuard)
@ApiTags('webhook')
@ApiSecurity(API_KEY_HEADER_NAME)
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
export class WebhookController {
  constructor(
    private readonly service: WebhookService,
  ) { }

  @Post()
  create(
    @Body() body: WebhookCreate,
  ) {
    return this.service.create(body)
  }

  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() body: WebhookUpdate,
  ) {
    return this.service.updateById(id, body)
  }

  @Delete(':id')
  deleteById(
    @Param('id') id: string,
  ) {
    return this.service.deleteById(id)
  }
}
