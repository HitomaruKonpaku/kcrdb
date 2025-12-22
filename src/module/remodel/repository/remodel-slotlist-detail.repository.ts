import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { RemodelSlotlistDetail } from '../model/remodel-slotlist-detail.entity'

@Injectable()
export class RemodelSlotlistDetailRepository extends BaseRepository<RemodelSlotlistDetail> {
  constructor(
    @InjectRepository(RemodelSlotlistDetail)
    public readonly repository: Repository<RemodelSlotlistDetail>,
  ) {
    super(repository)
  }
}
