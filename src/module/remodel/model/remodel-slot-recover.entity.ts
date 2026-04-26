import { Column, Entity } from 'typeorm'
import { RemodelBase } from './remodel.base.entity'

@Entity({ name: 'remodel_slot_recover' })
export class RemodelSlotRecover extends RemodelBase<any> {
  @Column({ name: 'api_id', type: 'smallint' })
  api_id: number

  @Column({ name: 'api_slot_id', type: 'smallint' })
  api_slot_id: number

  @Column({ name: 'api_slot_level', type: 'smallint' })
  api_slot_level: number

  @Column({ name: 'api_dev_num', type: 'smallint' })
  api_dev_num: number

  @Column({ name: 'api_recover_flag', type: 'smallint' })
  api_recover_flag: number
}
