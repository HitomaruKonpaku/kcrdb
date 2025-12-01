import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UseTokenGuard } from '../../../decorator/use-token-guard.decorator'
import { TokenOwnerGuard } from '../../token/guard/token-owner.guard'
import { WebhookCreate } from '../dto/webhook-create.dto'
import { WebhookUpdate } from '../dto/webhook-update.dto'
import { WebhookService } from '../service/webhook.service'

@Controller('webhooks')
@ApiTags('webhook')
@UseTokenGuard()
@UseGuards(TokenOwnerGuard)
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
