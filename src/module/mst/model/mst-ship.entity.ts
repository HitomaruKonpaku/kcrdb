import { Entity } from 'typeorm'
import { MstBaseEntity } from './mst.base.entity'

@Entity({ name: 'mst_ship' })
export class MstShip extends MstBaseEntity {
}
