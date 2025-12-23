import { Column, Entity } from 'typeorm'
import { RemodelBase } from './remodel.base.entity'

@Entity({ name: 'remodel_slot' })
export class RemodelSlot extends RemodelBase<any> {
  @Column({ name: 'api_id', type: 'smallint' })
  api_id: number

  @Column({ name: 'api_slot_id', type: 'smallint' })
  api_slot_id: number

  @Column({ name: 'api_slot_level', type: 'smallint' })
  api_slot_level: number

  @Column({ name: 'api_certain_flag', type: 'smallint', nullable: true })
  api_certain_flag?: number
}
