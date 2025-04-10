import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'simulator' })
export class Simulator extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true })
  hash?: string

  @Column({ name: 'data', type: 'varchar' })
  data: string
}
