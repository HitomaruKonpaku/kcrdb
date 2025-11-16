import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { BigIntTransformer } from '../../../shared/transformer/bigint.transformer'
import { QuestItemApi } from '../dto/quest-item-api.dto'

@Entity({ name: 'quest_item' })
export class QuestItem extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', unique: true, select: false })
  hash: string

  @Column({ name: 'api_quest_id', type: 'int' })
  api_quest_id: number

  @Column({ name: 'api_select_no', type: 'int', nullable: true, array: true })
  api_select_no?: number[]

  @Column({ name: 'data', type: 'json' })
  data: QuestItemApi

  @Column({ name: 'hit', type: 'bigint', nullable: true, default: 0, transformer: BigIntTransformer })
  hit?: number
}
