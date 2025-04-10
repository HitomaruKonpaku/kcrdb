import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'replay' })
export class Replay extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true })
  hash?: string

  @Column({ name: 'data', type: 'json' })
  data: Record<string, any>

  @Column({ name: 'world', type: 'int' })
  world: number

  @Column({ name: 'map', type: 'int' })
  map: number

  @Column({ name: 'diff', type: 'int', nullable: true })
  diff?: number
}
