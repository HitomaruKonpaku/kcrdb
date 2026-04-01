import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Logger } from '../../../shared/logger'
import { MstShip } from '../model/mst-ship.entity'
import { MstShipRepository } from '../repository/mst-ship.repository'
import { MstBaseService } from './mst.base.service'

@Injectable()
export class MstShipService extends MstBaseService<MstShip, MstShipRepository> {
  protected DATA_URL: string = 'https://raw.githubusercontent.com/Tibowl/api_start2/refs/heads/master/parsed/api_mst_ship.json'
  protected CACHE_KEY: string = 'kc.mst.ship'

  protected readonly logger = new Logger(MstShipService.name)

  constructor(
    public readonly repository: MstShipRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }
}
