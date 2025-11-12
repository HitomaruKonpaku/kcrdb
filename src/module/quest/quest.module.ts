import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestController } from './controller/quest.controller'
import { Quest } from './model/quest.entity'
import { QuestRepository } from './repository/quest.repository'
import { QuestService } from './service/quest.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quest,
    ]),
  ],
  controllers: [
    QuestController,
  ],
  providers: [
    QuestRepository,
    QuestService,
  ],
  exports: [
    QuestRepository,
    QuestService,
  ],
})
export class QuestModule { }
