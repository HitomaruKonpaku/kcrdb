import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { RemodelSlotRecover } from '../model/remodel-slot-recover.entity'

@Injectable()
export class RemodelSlotRecoverRepository extends BaseRepository<RemodelSlotRecover> {
  constructor(
    @InjectRepository(RemodelSlotRecover)
    public readonly repository: Repository<RemodelSlotRecover>,
  ) {
    super(repository)
  }
}
