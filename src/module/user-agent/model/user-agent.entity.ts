import { Column, Entity, Index, Unique } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'user_agent' })
@Unique(['sourceName', 'sourceId'])
export class UserAgent extends BaseEntity {
  @Index()
  @Column({ name: 'source_name', type: 'varchar' })
  sourceName: string

  @Column({ name: 'source_id', type: 'varchar' })
  sourceId: string

  @Column({ name: 'raw', type: 'varchar' })
  raw: string

  @Column({ name: 'origin', type: 'varchar', nullable: true })
  origin?: string

  @Column({ name: 'x_origin', type: 'varchar', nullable: true })
  xOrigin?: string
}
