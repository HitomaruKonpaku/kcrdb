import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventRewardController } from './controller/event-reward.controller'
import { EventReward } from './model/event-reward.entity'
import { EventRewardRepository } from './repository/event-reward.repository'
import { EventRewardService } from './service/event-reward.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventReward,
    ]),
  ],
  controllers: [
    EventRewardController,
  ],
  providers: [
    EventRewardRepository,
    EventRewardService,
  ],
  exports: [
    EventRewardRepository,
    EventRewardService,
  ],
})
export class EventRewardModule { }
