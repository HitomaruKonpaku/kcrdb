import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { DataCacheInterceptor } from '../../../interceptor/data-cache.interceptor'
import { DataTransformInterceptor } from '../../../interceptor/data-transform.interceptor'
import { HitInterceptor } from '../../../interceptor/hit.interceptor'
import { UserAgentInterceptor } from '../../user-agent/interceptor/user-agent.interceptor'
import { SimulatorCreate } from '../dto/simulator-create.dto'
import { Simulator } from '../dto/simulator.dto'
import { SimulatorService } from '../service/simulator.service'

@Controller('simulators')
@ApiTags('simulator')
@SourceName('simulator')
export class SimulatorController {
  constructor(
    private readonly service: SimulatorService,
  ) { }

  @Post()
  @UseInterceptors(UserAgentInterceptor, DataCacheInterceptor)
  @ApiCreatedResponse({ type: Simulator })
  create(
    @Body() body: SimulatorCreate,
  ) {
    return this.service.create(body)
  }

  @Get(':id')
  @UseInterceptors(HitInterceptor)
  @ApiOkResponse({ type: Simulator })
  @ApiNotFoundResponse()
  getId(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }

  @Get(':id/data')
  @UseInterceptors(DataTransformInterceptor, HitInterceptor, DataCacheInterceptor)
  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse()
  getIdData(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }
}
