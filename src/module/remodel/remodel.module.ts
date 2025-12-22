import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RemodelSlotController } from './controller/remodel-slot.controller'
import { RemodelSlotlistDetailController } from './controller/remodel-slotlist-detail.controller'
import { RemodelSlotlistController } from './controller/remodel-slotlist.controller'
import { RemodelSlot } from './model/remodel-slot.entity'
import { RemodelSlotlistDetail } from './model/remodel-slotlist-detail.entity'
import { RemodelSlotlist } from './model/remodel-slotlist.entity'
import { RemodelSlotRepository } from './repository/remodel-slot.repository'
import { RemodelSlotlistDetailRepository } from './repository/remodel-slotlist-detail.repository'
import { RemodelSlotlistRepository } from './repository/remodel-slotlist.repository'
import { RemodelSlotService } from './service/remodel-slot.service'
import { RemodelSlotlistDetailService } from './service/remodel-slotlist-detail.service'
import { RemodelSlotlistService } from './service/remodel-slotlist.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RemodelSlotlist,
      RemodelSlotlistDetail,
      RemodelSlot,
    ]),
  ],
  controllers: [
    RemodelSlotlistController,
    RemodelSlotlistDetailController,
    RemodelSlotController,
  ],
  providers: [
    RemodelSlotlistRepository,
    RemodelSlotlistDetailRepository,
    RemodelSlotRepository,
    RemodelSlotlistService,
    RemodelSlotlistDetailService,
    RemodelSlotService,
  ],
  exports: [
    RemodelSlotlistRepository,
    RemodelSlotlistDetailRepository,
    RemodelSlotRepository,
    RemodelSlotlistService,
    RemodelSlotlistDetailService,
    RemodelSlotService,
  ],
})
export class RemodelModule { }
