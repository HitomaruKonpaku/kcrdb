import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiExtraDto } from '../../../shared/kcsapi/dto/kcsapi-extra.dto'
import { RemodelSlotlistCreate } from '../dto/remodel-slotlist-create.dto'
import { RemodelSlotlistFilter } from '../dto/remodel-slotlist-filter.dto'
import { RemodelSlotlistService } from '../service/remodel-slotlist.service'

@Controller('remodel_slotlist')
@ApiTags('remodel')
@SourceName('remodel_slotlist')
export class RemodelSlotlistController {
  constructor(
    private readonly service: RemodelSlotlistService,
  ) { }

  @Get()
  @ApiPaginatedResponse(RemodelSlotlistCreate)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: RemodelSlotlistFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: KcsapiExtraDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_kousyou/remodel_slotlist</code> response data',
    tags: ['remodel', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: RemodelSlotlistCreate })
  create(
    @Body() body: RemodelSlotlistCreate,
  ) {
    return this.service.create(body)
  }
}
