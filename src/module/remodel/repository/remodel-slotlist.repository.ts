import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { RemodelSlotlist } from '../model/remodel-slotlist.entity'

@Injectable()
export class RemodelSlotlistRepository extends BaseRepository<RemodelSlotlist> {
  constructor(
    @InjectRepository(RemodelSlotlist)
    public readonly repository: Repository<RemodelSlotlist>,
  ) {
    super(repository)
  }
}
