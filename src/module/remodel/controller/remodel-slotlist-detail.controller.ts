import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { RemodelExtra } from '../dto/remodel-extra.dto'
import { RemodelSlotlistDetailFilter } from '../dto/remodel-slot-filter.dto'
import { RemodelSlotlistDetailCreate } from '../dto/remodel-slotlist-detail-create.dto'
import { RemodelSlotlistDetailService } from '../service/remodel-slotlist-detail.service'

@Controller('remodel_slotlist_detail')
@ApiTags('remodel')
@SourceName('remodel_slotlist_detail')
export class RemodelSlotlistDetailController {
  constructor(
    private readonly service: RemodelSlotlistDetailService,
  ) { }

  @Get()
  @ApiPaginatedResponse(RemodelSlotlistDetailCreate)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: RemodelSlotlistDetailFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: RemodelExtra,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_kousyou/remodel_slotlist_detail</code> response data',
    tags: ['remodel', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: RemodelSlotlistDetailCreate })
  create(
    @Body() body: RemodelSlotlistDetailCreate,
  ) {
    return this.service.create(body)
  }
}
