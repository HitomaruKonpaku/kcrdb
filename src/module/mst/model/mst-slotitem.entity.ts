import { Entity } from 'typeorm'
import { MstBaseEntity } from './mst.base.entity'

@Entity({ name: 'mst_slotitem' })
export class MstSlotitem extends MstBaseEntity {
}
