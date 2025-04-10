import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ReplayCreate } from '../dto/replay-create.dto'
import { ReplayService } from '../service/replay.service'

@Controller('replays')
@ApiTags('replay')
export class ReplayController {
  constructor(
    private readonly service: ReplayService,
  ) { }

  @Post()
  create(
    @Body() body: ReplayCreate,
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
