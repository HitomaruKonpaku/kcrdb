import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { QuestRaw } from '../dto/quest-raw.dto'

@Entity({ name: 'quest' })
export class Quest extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true, unique: true, select: false })
  hash?: string

  @Column({ name: 'data', type: 'json' })
  data: QuestRaw

  @Column({ name: 'datab', type: 'jsonb', nullable: true, select: false })
  datab?: QuestRaw
}
