import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'replay' })
export class Replay extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true, unique: true })
  hash?: string

  @Column({ name: 'data', type: 'json' })
  data: Record<string, any>

  @Column({ name: 'hit', type: 'int', nullable: true, default: 0 })
  hit?: number

  @Column({ name: 'world', type: 'int', nullable: true })
  world: number

  @Column({ name: 'map', type: 'int', nullable: true })
  map: number

  @Column({ name: 'diff', type: 'int', nullable: true })
  diff?: number
}
