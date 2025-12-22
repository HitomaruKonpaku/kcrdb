import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { RemodelSlotCreate } from '../dto/remodel-slot-create.dto'
import { RemodelSlotFilter } from '../dto/remodel-slotlist-filter.dto'
import { RemodelSlotService } from '../service/remodel-slot.service'

@Controller('remodel_slot')
@ApiTags('remodel')
@SourceName('remodel_slot')
export class RemodelSlotController {
  constructor(
    private readonly service: RemodelSlotService,
  ) { }

  @Get()
  @ApiPaginatedResponse(RemodelSlotCreate)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: RemodelSlotFilter,
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @ApiCreatedResponse({ type: RemodelSlotCreate })
  create(
    @Body() body: RemodelSlotCreate,
  ) {
    return this.service.create(body)
  }
}
