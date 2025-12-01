import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'webhook' })
export class Webhook extends BaseEntity {
  @Column({ name: 'version', type: 'int', default: 1 })
  version?: number

  @Column({ name: 'url', type: 'varchar' })
  url: string

  @Column({ name: 'on_quest_new_submit', type: 'boolean', default: false })
  onQuestNewSubmit?: boolean

  @Column({ name: 'on_quest_new_unknown', type: 'boolean', default: false })
  onQuestNewUnknown?: boolean
}
