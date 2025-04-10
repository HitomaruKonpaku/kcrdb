import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Replay } from '../model/replay.entity'

@Injectable()
export class ReplayRepository extends BaseRepository<Replay> {
  constructor(
    @InjectRepository(Replay)
    public readonly repository: Repository<Replay>,
  ) {
    super(repository)
  }
}
