import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SimulatorController } from './controller/simulator.controller'
import { Simulator } from './model/simulator.entity'
import { SimulatorRepository } from './repository/simulator.repository'
import { SimulatorService } from './service/simulator.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Simulator,
    ]),
  ],
  controllers: [
    SimulatorController,
  ],
  providers: [
    SimulatorRepository,
    SimulatorService,
  ],
  exports: [
    SimulatorRepository,
    SimulatorService,
  ],
})
export class SimulatorModule { }
