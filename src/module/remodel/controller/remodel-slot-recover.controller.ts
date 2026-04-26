import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedWithMetadataResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { RemodelExtraDto } from '../dto/remodel-extra.dto'
import { RemodelMetadataDto } from '../dto/remodel-metadata.dto'
import { RemodelSlotRecoverCreate } from '../dto/remodel-slot-recover-create.dto'
import { RemodelSlotRecoverFilter } from '../dto/remodel-slot-recover-filter.dto'
import { RemodelSlotRecoverService } from '../service/remodel-slot-recover.service'

@Controller('remodel_slot_recover')
@ApiTags('remodel')
@SourceName('remodel_slot_recover')
export class RemodelSlotRecoverController {
  constructor(
    private readonly service: RemodelSlotRecoverService,
  ) { }

  @Get()
  @ApiPaginatedWithMetadataResponse(RemodelSlotRecoverCreate, RemodelMetadataDto)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: RemodelSlotRecoverFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: RemodelExtraDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_kousyou/remodel_slot_recover</code> response data',
    tags: ['remodel', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: RemodelSlotRecoverCreate })
  create(
    @Body() body: RemodelSlotRecoverCreate,
  ) {
    return this.service.create(body)
  }
}
