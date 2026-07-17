import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataCacheUrlInterceptor } from '../../../interceptor/data-cache-url.interceptor'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { EventRewardCreate } from '../dto/event-reward-create.dto'
import { EventReward } from '../dto/event-reward.dto'
import { EventRewardFilter } from '../dto/event-reward-filter.dto'
import { EventRewardService } from '../service/event-reward.service'

@Controller('event-rewards')
@ApiTags('event-reward')
@SourceName('event_reward')
export class EventRewardController {
  constructor(
    private readonly service: EventRewardService,
  ) { }

  @Get()
  @UseInterceptors(DataCacheUrlInterceptor)
  @ApiPaginatedResponse(EventReward)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: EventRewardFilter,
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_sortie/battleresult</code> event reward data',
    tags: ['event-reward', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: EventRewardCreate })
  create(
    @Body() body: EventRewardCreate,
  ) {
    return this.service.create(body)
  }
}
