import { Column, Entity, Index } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'user_agent' })
export class UserAgent extends BaseEntity {
  @Index()
  @Column({ name: 'source_name', type: 'varchar' })
  sourceName: string

  @Index()
  @Column({ name: 'source_id', type: 'varchar' })
  sourceId: string

  @Column({ name: 'raw', type: 'varchar' })
  raw: string

  @Column({ name: 'origin', type: 'varchar', nullable: true })
  origin?: string

  @Column({ name: 'x_origin', type: 'varchar', nullable: true })
  xOrigin?: string

  @Column({ name: 'x_version', type: 'varchar', nullable: true })
  xVersion?: string

  @Column({ name: 'hit', type: 'int', nullable: true, default: 0 })
  hit?: number
}
