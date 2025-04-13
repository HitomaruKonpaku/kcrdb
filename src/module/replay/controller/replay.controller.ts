import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
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
  @ApiCreatedResponse({ type: Replay })
  create(
    @Body() body: ReplayCreate,
  ) {
    return this.service.create(body)
  }

  @Get(':id')
  @ApiOkResponse({ type: Replay })
  @ApiNotFoundResponse()
  getId(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
  }

  @Get(':id/data')
  @ApiOkResponse({ type: Object })
  @ApiNotFoundResponse()
  getIdData(
    @Param('id') id: string,
  ) {
    return this.service.findOneById(id)
      .then((v) => v.data)
  }
}
