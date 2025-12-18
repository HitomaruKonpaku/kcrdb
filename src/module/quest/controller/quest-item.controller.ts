import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataCacheUrlInterceptor } from '../../../interceptor/data-cache-url.interceptor'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { QuestItemCreate } from '../dto/quest-item-create.dto'
import { QuestItemExtra } from '../dto/quest-item-extra.dto'
import { QuestItemFilter } from '../dto/quest-item-filter.dto'
import { QuestItem } from '../dto/quest-item.dto'
import { QuestItemService } from '../service/quest-item.service'

@Controller('quest-items')
@ApiTags('quest-item')
@SourceName('quest_item')
export class QuestItemController {
  constructor(
    private readonly service: QuestItemService,
  ) { }

  @Get()
  @UseInterceptors(DataCacheUrlInterceptor)
  @ApiPaginatedResponse(QuestItem)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: QuestItemFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: QuestItemExtra,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_quest/clearitemget</code> response data',
    tags: ['quest-item', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: QuestItem })
  create(
    @Body() body: QuestItemCreate,
  ) {
    return this.service.create(body)
  }
}
