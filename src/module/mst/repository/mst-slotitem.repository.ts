import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MstSlotitem } from '../model/mst-slotitem.entity'
import { MstBaseRepository } from './mst.base.repository'

@Injectable()
export class MstSlotitemRepository extends MstBaseRepository<MstSlotitem> {
  constructor(
    @InjectRepository(MstSlotitem)
    public readonly repository: Repository<MstSlotitem>,
  ) {
    super(repository)
  }
}
