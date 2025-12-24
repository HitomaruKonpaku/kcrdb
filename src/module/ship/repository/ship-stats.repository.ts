import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { ShipStats } from '../model/ship-stats.entity'

@Injectable()
export class ShipStatsRepository extends BaseRepository<ShipStats> {
  constructor(
    @InjectRepository(ShipStats)
    public readonly repository: Repository<ShipStats>,
  ) {
    super(repository)
  }
}
