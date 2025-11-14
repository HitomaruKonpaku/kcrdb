import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { QuestApi } from '../dto/quest-api.dto'

@Entity({ name: 'quest' })
export class Quest extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true, unique: true, select: false })
  hash?: string

  @Column({ name: 'data', type: 'json' })
  data: QuestApi

  @Column({ name: 'hit', type: 'int', nullable: true, default: 0 })
  hit?: number

  @Column({ name: 'datab', type: 'jsonb', nullable: true, select: false })
  datab?: QuestApi
}
