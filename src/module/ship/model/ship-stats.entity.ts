import { Column, Entity, Index } from 'typeorm'
import { KcsapiEntity } from '../../../shared/kcsapi/kcsapi.entity'
import { ShipStatsEstimation } from '../dto/ship-stats-estimation.dto'
import { ShipStatsType } from '../enum/ship-stats.enum'

@Entity({ name: 'ship_stats' })
export class ShipStats extends KcsapiEntity<any> {
  @Index()
  @Column({ name: 'type', type: 'varchar' })
  type: ShipStatsType

  @Index()
  @Column({ name: 'api_ship_id', type: 'smallint' })
  api_ship_id: number

  @Column({ name: 'api_lv', type: 'smallint' })
  api_lv: number

  @Column({ name: 'api_slot_mst_id  ', type: 'smallint', nullable: true, array: true })
  api_slot_mst_id?: number[]

  @Column({ name: 'slot_empty', type: 'boolean', nullable: true })
  slot_empty?: boolean

  @Column({ name: 'estimation', type: 'json', nullable: true })
  estimation?: ShipStatsEstimation
}
