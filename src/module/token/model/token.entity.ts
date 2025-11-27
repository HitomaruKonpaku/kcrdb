import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @Column({ name: 'first_seen_at', type: 'timestamptz', nullable: true })
  firstSeenAt?: Date

  @Column({ name: 'last_seen_at', type: 'timestamptz', nullable: true })
  lastSeenAt?: Date

  @Column({ name: 'comment', type: 'varchar', nullable: true, select: false })
  comment?: string

  @Column({ name: 'is_owner', type: 'boolean', default: false })
  isOwner?: boolean

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin?: boolean
}
