import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { KeyDelete } from '../../../decorator/key-delete.decorator'
import { SourceName } from '../../../decorator/source-name.decorator'
import { TrackUserAgent } from '../../../decorator/track-user-agent.decorator'
import { DataCacheUrlInterceptor } from '../../../interceptor/data-cache-url.interceptor'
import { DataHitHashInterceptor } from '../../../interceptor/data-hit-hash.interceptor'
import { DataKeyDeleteInterceptor } from '../../../interceptor/data-key-delete.interceptor'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { ShipStatsCreate } from '../dto/ship-stats-create.dto'
import { ShipStatsFilter } from '../dto/ship-stats-filter.dto'
import { ShipStats } from '../dto/ship-stats.dto'
import { ShipStatsService } from '../service/ship-stats.service'

@Controller('ship_stats')
@ApiTags('ship')
@SourceName('ship_stats')
export class ShipStatsController {
  constructor(
    private readonly service: ShipStatsService,
  ) { }

  @Get()
  @UseInterceptors(DataCacheUrlInterceptor)
  @ApiPaginatedResponse(ShipStats)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: ShipStatsFilter,
    @Query() timeFilter: TimeFilterDto,
  ) {
    return this.service.getAll(paging, filter, timeFilter)
  }

  @Post()
  @UseInterceptors(DataHitHashInterceptor)
  @TrackUserAgent()
  @UseInterceptors(DataKeyDeleteInterceptor)
  @KeyDelete('hashes')
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
    @Body() body: ShipStatsCreate,
  ) {
    return this.service.createMany(body)
  }
}
