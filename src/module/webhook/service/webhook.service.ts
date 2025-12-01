import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import Bottleneck from 'bottleneck'
import { BaseService } from '../../../shared/base/base.service'
import { Logger } from '../../../shared/logger'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { IdUtil } from '../../../shared/util/id.util'
import { WEBHOOK_VERSION } from '../constant/webhook.constant'
import { WebhookCreate } from '../dto/webhook-create.dto'
import { Webhook } from '../model/webhook.entity'
import { WebhookRepository } from '../repository/webhook.repository'

@Injectable()
export class WebhookService extends BaseService<Webhook, WebhookRepository> {
  private readonly logger = new Logger(WebhookService.name)

  private readonly limiter = new Bottleneck({
    maxConcurrent: 5,
  })

  constructor(
    public readonly repository: WebhookRepository,
    private readonly configService: ConfigService,
  ) {
    super(repository)
  }

  public async create(body: WebhookCreate) {
    const res = await this.repository.save({
      ...body,
      id: IdUtil.generate(),
      version: WEBHOOK_VERSION,
      url: CryptoUtil.encrypt(body.url, this.configService.getOrThrow('ENCRYPTION_SECRET')),
    })
    return res
  }

  public async send(webhook: Webhook, content: string, throwError = false) {
    await this.limiter.schedule(async () => {
      this.logger.debug(`--> send | ${JSON.stringify({ id: webhook.id })}`)
      try {
        const reqUrl = CryptoUtil.decrypt(webhook.url, this.configService.getOrThrow('ENCRYPTION_SECRET'))
        await axios.post(reqUrl, { content })
        this.logger.debug(`<-- send | ${JSON.stringify({ id: webhook.id })}`)
      } catch (error) {
        this.logger.error(`<-- send | ${JSON.stringify({ id: webhook.id, error })}`)
        if (throwError) {
          throw error
        }
      }
    })
  }
}
