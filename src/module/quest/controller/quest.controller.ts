import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { KeyDelete } from '../../../decorator/key-delete.decorator'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataCacheUrlInterceptor } from '../../../interceptor/data-cache-url.interceptor'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { DataKeyDeleteInterceptor } from '../../../interceptor/data-key-delete.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { QuestApi } from '../dto/quest-api.dto'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestExtra } from '../dto/quest-extra.dto'
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
  @UseInterceptors(DataCacheUrlInterceptor)
  @ApiPaginatedResponse(Quest)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: QuestFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: QuestExtra,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Get('data')
  @UseInterceptors(DataCacheUrlInterceptor)
  @ApiPaginatedResponse(QuestApi)
  getAllRaw(
    @Query() paging: PagingDto,
    @Query() filter: QuestFilter,
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAllRaw(paging, filter, timeFilter)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @UseInterceptors(DataKeyDeleteInterceptor)
  @KeyDelete('hashes')
  @ApiOperation({
    description: '<code>/kcsapi/api_get_member/questlist</code> response data',
    tags: ['quest', 'kcsapi'],
  })
  @ApiCreatedResponse({
    schema: {
      allOf: [
        {
          properties: {
            total: {
              type: 'number',
            },
            ids: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      ],
    },
  })
  create(
    @Body() body: QuestCreate,
  ) {
    return this.service.create(body)
  }
}
