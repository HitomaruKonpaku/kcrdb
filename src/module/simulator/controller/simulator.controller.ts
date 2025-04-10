import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SimulatorCreate } from '../dto/simulator-create.dto'
import { SimulatorService } from '../service/simulator.service'

@Controller('simulators')
@ApiTags('simulator')
export class SimulatorController {
  constructor(
    private readonly service: SimulatorService,
  ) { }

  @Post()
  create(
    @Body() body: SimulatorCreate,
  ) {
    return this.service.create(body)
  }

  @Get(':id')
  getId(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }

  @Get(':id/data')
  getIdData(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
      .then((v) => v.data)
  }
}
