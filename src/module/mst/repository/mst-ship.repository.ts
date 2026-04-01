import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MstShip } from '../model/mst-ship.entity'
import { MstBaseRepository } from './mst.base.repository'

@Injectable()
export class MstShipRepository extends MstBaseRepository<MstShip> {
  constructor(
    @InjectRepository(MstShip)
    public readonly repository: Repository<MstShip>,
  ) {
    super(repository)
  }
}
