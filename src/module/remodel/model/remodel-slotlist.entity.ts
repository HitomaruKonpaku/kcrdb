import { Entity } from 'typeorm'
import { RemodelBase } from './remodel.base.entity'

@Entity({ name: 'remodel_slotlist' })
export class RemodelSlotlist extends RemodelBase<any> {
}
