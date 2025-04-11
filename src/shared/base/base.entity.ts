import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
  })
  id: string

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive?: boolean

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt?: Date

  @Column({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt?: Date
}
