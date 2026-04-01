import { Column, PrimaryColumn } from 'typeorm'

export abstract class MstBaseEntity {
  @PrimaryColumn({
    name: 'api_id',
    type: 'smallint',
  })
  api_id: number

  @Column({
    name: 'api_name',
    type: 'varchar',
  })
  api_name: string
}
