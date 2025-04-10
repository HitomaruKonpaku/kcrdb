import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReplayController } from './controller/replay.controller'
import { Replay } from './model/replay.entity'
import { ReplayRepository } from './repository/replay.repository'
import { ReplayService } from './service/replay.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Replay,
    ]),
  ],
  controllers: [
    ReplayController,
  ],
  providers: [
    ReplayRepository,
    ReplayService,
  ],
  exports: [
    ReplayRepository,
    ReplayService,
  ],
})
export class ReplayModule { }
