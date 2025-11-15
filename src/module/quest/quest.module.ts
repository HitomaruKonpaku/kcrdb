import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestItemController } from './controller/quest-item.controller'
import { QuestController } from './controller/quest.controller'
import { QuestItem } from './model/quest-item.entity'
import { Quest } from './model/quest.entity'
import { QuestItemRepository } from './repository/quest-item.repository'
import { QuestRepository } from './repository/quest.repository'
import { QuestItemService } from './service/quest-item.service'
import { QuestSusService } from './service/quest-sus.service'
import { QuestService } from './service/quest.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quest,
      QuestItem,
    ]),
  ],
  controllers: [
    QuestController,
    QuestItemController,
  ],
  providers: [
    QuestRepository,
    QuestItemRepository,
    QuestService,
    QuestItemService,
    QuestSusService,
  ],
  exports: [
    QuestRepository,
    QuestService,
    QuestRepository,
    QuestItemRepository,
    QuestService,
    QuestItemService,
    QuestSusService,
  ],
})
export class QuestModule { }
