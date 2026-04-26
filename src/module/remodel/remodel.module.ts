import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RemodelSlotRecoverController } from './controller/remodel-slot-recover.controller'
import { RemodelSlotController } from './controller/remodel-slot.controller'
import { RemodelSlotlistDetailController } from './controller/remodel-slotlist-detail.controller'
import { RemodelSlotlistController } from './controller/remodel-slotlist.controller'
import { RemodelSlotRecover } from './model/remodel-slot-recover.entity'
import { RemodelSlot } from './model/remodel-slot.entity'
import { RemodelSlotlistDetail } from './model/remodel-slotlist-detail.entity'
import { RemodelSlotlist } from './model/remodel-slotlist.entity'
import { RemodelSlotRecoverRepository } from './repository/remodel-slot-recover.repository'
import { RemodelSlotRepository } from './repository/remodel-slot.repository'
import { RemodelSlotlistDetailRepository } from './repository/remodel-slotlist-detail.repository'
import { RemodelSlotlistRepository } from './repository/remodel-slotlist.repository'
import { RemodelSlotRecoverService } from './service/remodel-slot-recover.service'
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
      RemodelSlotRecover,
    ]),
  ],
  controllers: [
    RemodelSlotlistController,
    RemodelSlotlistDetailController,
    RemodelSlotController,
    RemodelSlotRecoverController,
  ],
  providers: [
    RemodelSlotlistRepository,
    RemodelSlotlistDetailRepository,
    RemodelSlotRepository,
    RemodelSlotRecoverRepository,

    RemodelSlotlistService,
    RemodelSlotlistDetailService,
    RemodelSlotService,
    RemodelSlotRecoverService,
  ],
  exports: [
    RemodelSlotlistRepository,
    RemodelSlotlistDetailRepository,
    RemodelSlotRepository,
    RemodelSlotRecoverRepository,

    RemodelSlotlistService,
    RemodelSlotlistDetailService,
    RemodelSlotService,
    RemodelSlotRecoverService,
  ],
})
export class RemodelModule { }
