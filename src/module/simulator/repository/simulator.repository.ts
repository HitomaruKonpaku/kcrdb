import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Simulator } from '../model/simulator.entity'

@Injectable()
export class SimulatorRepository extends BaseRepository<Simulator> {
  constructor(
    @InjectRepository(Simulator)
    public readonly repository: Repository<Simulator>,
  ) {
    super(repository)
  }
}
