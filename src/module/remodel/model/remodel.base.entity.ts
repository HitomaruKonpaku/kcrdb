import { Column, Index } from 'typeorm'
import { KcsapiEntity } from '../../../shared/kcsapi/kcsapi.entity'

export abstract class RemodelBase<T> extends KcsapiEntity<T> {
  @Column({ name: 'flag_ship_id', type: 'smallint' })
  flag_ship_id: number

  @Index()
  @Column({ name: 'helper_ship_id', type: 'smallint' })
  helper_ship_id: number

  @Index()
  @Column({ name: 'day', type: 'smallint' })
  day: number
}
