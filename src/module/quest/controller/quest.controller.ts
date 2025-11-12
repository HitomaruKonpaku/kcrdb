import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { UserAgentInterceptor } from '../../user-agent/interceptor/user-agent.interceptor'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestFilter } from '../dto/quest-filter.dto'
import { QuestRaw } from '../dto/quest-raw.dto'
import { Quest } from '../dto/quest.dto'
import { QuestService } from '../service/quest.service'

@Controller('quests')
@ApiTags('quest')
@SourceName('quest')
export class QuestController {
  constructor(
    private readonly service: QuestService,
  ) { }

  @Get()
  @ApiPaginatedResponse(Quest)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: QuestFilter,
  ) {
    return this.service.getAll(paging, filter)
  }

  @Get('raw')
  @ApiPaginatedResponse(QuestRaw)
  getAllRaw(
    @Query() paging: PagingDto,
    @Query() filter: QuestFilter,
  ) {
    return this.service.getAllRaw(paging, filter)
  }

  @Post()
  @UseInterceptors(UserAgentInterceptor)
  create(
    @Body() body: QuestCreate,
  ) {
    return this.service.create(body)
  }
}
