import { Column, Entity, Index } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'webhook_history' })
export class WebhookHistory extends BaseEntity {
  @Column({ name: 'webhook_id', type: 'varchar' })
  webhookId: string

  @Index()
  @Column({ name: 'source_name', type: 'varchar' })
  sourceName: string

  @Column({ name: 'source_id', type: 'varchar' })
  sourceId: string

  @Column({ name: 'is_success', type: 'boolean', default: false })
  isSuccess?: boolean

  @Column({ name: 'is_error', type: 'boolean', default: false })
  isError?: boolean

  @Column({ name: 'error_message', type: 'varchar', nullable: true })
  errorMessage?: string

  @Column({ name: 'error_stack', type: 'varchar', nullable: true })
  errorStack?: string
}
