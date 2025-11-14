import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SourceName } from '../../../decorator/source-name.decorator'
import { ApiPaginatedResponse } from '../../../shared/decorator/pagination.decorator'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { UserAgentInterceptor } from '../../user-agent/interceptor/user-agent.interceptor'
import { QuestItemCreate } from '../dto/quest-item-create.dto'
import { QuestItemFilter } from '../dto/quest-item-filter.dto'
import { QuestItem } from '../dto/quest-item.dto'
import { QuestItemService } from '../service/quest-item.service'

@Controller('quest-items')
@ApiTags('quest-item')
@SourceName('quest-item')
export class QuestItemController {
  constructor(
    private readonly service: QuestItemService,
  ) { }

  @Get()
  @ApiPaginatedResponse(QuestItem)
  getAll(
    @Query() paging: PagingDto,
    @Query() filter: QuestItemFilter,
  ) {
    return this.service.getAll(paging, filter)
  }

  @Post()
  @UseInterceptors(UserAgentInterceptor)
  create(
    @Body() body: QuestItemCreate,
  ) {
    return this.service.create(body)
  }
}
