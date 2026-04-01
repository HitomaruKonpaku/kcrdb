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
import { RemodelSlotCreate } from '../dto/remodel-slot-create.dto'
import { RemodelSlotFilter } from '../dto/remodel-slot-filter.dto'
import { RemodelSlotService } from '../service/remodel-slot.service'

@Controller('remodel_slot')
@ApiTags('remodel')
@SourceName('remodel_slot')
export class RemodelSlotController {
  constructor(
    private readonly service: RemodelSlotService,
  ) { }

  @Get()
  @ApiPaginatedWithMetadataResponse(RemodelSlotCreate, RemodelMetadataDto)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: RemodelSlotFilter,
    @Query() timeFilter: TimeFilterDto,
    @Query() extra: RemodelExtraDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter, extra)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiOperation({
    description: '<code>/kcsapi/api_req_kousyou/remodel_slot</code> response data',
    tags: ['remodel', 'kcsapi'],
  })
  @ApiCreatedResponse({ type: RemodelSlotCreate })
  create(
    @Body() body: RemodelSlotCreate,
  ) {
    return this.service.create(body)
  }
}
