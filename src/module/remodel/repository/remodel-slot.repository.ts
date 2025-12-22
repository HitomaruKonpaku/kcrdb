import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { RemodelSlot } from '../model/remodel-slot.entity'

@Injectable()
export class RemodelSlotRepository extends BaseRepository<RemodelSlot> {
  constructor(
    @InjectRepository(RemodelSlot)
    public readonly repository: Repository<RemodelSlot>,
  ) {
    super(repository)
  }
}
