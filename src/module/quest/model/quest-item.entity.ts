import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'quest_item' })
export class QuestItem extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true, unique: true, select: false })
  hash?: string

  @Column({ name: 'api_quest_id', type: 'int' })
  api_quest_id: number

  @Column({ name: 'data', type: 'json' })
  data: any

  @Column({ name: 'datab', type: 'jsonb', nullable: true, select: false })
  datab?: any
}
