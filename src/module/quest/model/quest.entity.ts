import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'quest' })
export class Quest extends BaseEntity {
  @Column({ name: 'hash', type: 'varchar', nullable: true, unique: true, select: false })
  hash?: string

  @Column({ name: 'data', type: 'json' })
  data: Record<string, any>

  @Column({ name: 'api_no', type: 'int', nullable: true })
  api_no?: number

  @Column({ name: 'api_category', type: 'int', nullable: true })
  api_category?: number

  @Column({ name: 'api_type', type: 'int', nullable: true })
  api_type?: number

  @Column({ name: 'api_label_type', type: 'int', nullable: true })
  api_label_type?: number
}
