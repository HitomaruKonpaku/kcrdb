import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MstShip } from './model/mst-ship.entity'
import { MstSlotitem } from './model/mst-slotitem.entity'
import { MstShipRepository } from './repository/mst-ship.repository'
import { MstSlotitemRepository } from './repository/mst-slotitem.repository'
import { MstShipService } from './service/mst-ship.service'
import { MstSlotitemService } from './service/mst-slotitem.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MstShip,
      MstSlotitem,
    ]),
  ],
  providers: [
    MstShipRepository,
    MstSlotitemRepository,
    MstShipService,
    MstSlotitemService,
  ],
  exports: [
    MstShipRepository,
    MstSlotitemRepository,
    MstShipService,
    MstSlotitemService,
  ],
})
export class MstModule { }
