import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShipStatsController } from './controller/ship-stats.controller'
import { ShipStats } from './model/ship-stats.entity'
import { ShipStatsRepository } from './repository/ship-stats.repository'
import { ShipStatsService } from './service/ship-stats.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShipStats,
    ]),
  ],
  controllers: [
    ShipStatsController,
  ],
  providers: [
    ShipStatsRepository,
    ShipStatsService,
  ],
  exports: [
    ShipStatsRepository,
    ShipStatsService,
  ],
})
export class ShipModule { }
