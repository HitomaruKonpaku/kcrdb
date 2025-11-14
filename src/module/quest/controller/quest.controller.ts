import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { DataHashHitInterceptor } from '../../../interceptor/data-hash-hit.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { UserAgentInterceptor } from '../../user-agent/interceptor/user-agent.interceptor'
import { QuestApi } from '../dto/quest-api.dto'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestFilter } from '../dto/quest-filter.dto'
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
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter)
  }

  @Get('data')
  @ApiPaginatedResponse(QuestApi)
  getAllRaw(
    @Query() paging: PagingDto,
    @Query() filter: QuestFilter,
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAllRaw(paging, filter, timeFilter)
  }

  @Post()
  @UseInterceptors(UserAgentInterceptor, DataHashHitInterceptor)
  create(
    @Body() body: QuestCreate,
  ) {
    return this.service.create(body)
  }
}
