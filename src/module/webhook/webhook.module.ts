import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WebhookController } from './controller/webhook.controller'
import { WebhookHistory } from './model/webhook-history.entity'
import { Webhook } from './model/webhook.entity'
import { WebhookRepository } from './repository/webhook.repository'
import { WebhookService } from './service/webhook.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Webhook,
      WebhookHistory,
    ]),
  ],
  controllers: [
    WebhookController,
  ],
  providers: [
    WebhookRepository,
    WebhookService,
  ],
  exports: [
    WebhookRepository,
    WebhookService,
  ],
})
export class WebhookModule { }
