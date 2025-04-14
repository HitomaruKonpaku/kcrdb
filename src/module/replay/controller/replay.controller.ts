import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { DataInterceptor } from '../../../interceptor/data.interceptor'
import { HitInterceptor } from '../../../interceptor/hit.interceptor'
import { UserAgentInterceptor } from '../../user-agent/interceptor/user-agent.interceptor'
import { ReplayCreate } from '../dto/replay-create.dto'
import { Replay } from '../dto/replay.dto'
import { ReplayService } from '../service/replay.service'

@Controller('replays')
@ApiTags('replay')
export class ReplayController {
  constructor(
    private readonly service: ReplayService,
  ) { }

  @Post()
  @UseInterceptors(UserAgentInterceptor)
  @SourceName('replay')
  @ApiCreatedResponse({ type: Replay })
  create(
    @Body() body: ReplayCreate,
  ) {
    return this.service.create(body)
  }

  @Get(':id')
  @UseInterceptors(HitInterceptor)
  @SourceName('replay')
  @ApiOkResponse({ type: Replay })
  @ApiNotFoundResponse()
  getId(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }

  @Get(':id/data')
  @UseInterceptors(DataInterceptor, HitInterceptor)
  @SourceName('replay')
  @ApiOkResponse({ type: Object })
  @ApiNotFoundResponse()
  getIdData(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }
}
