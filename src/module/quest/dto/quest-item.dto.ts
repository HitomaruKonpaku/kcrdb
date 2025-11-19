import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'
import { UAOrigin } from '../../user-agent/dto/ua-origin.dto'
import { QuestItemApi } from './quest-item-api.dto'

export class QuestItem extends BaseDto {
  @ApiProperty()
  api_quest_id: number

  @ApiPropertyOptional({ type: [Number] })
  api_select_no?: number[]

  @ApiProperty({ type: QuestItemApi })
  data: QuestItemApi

  @ApiPropertyOptional()
  hit?: number

  @ApiPropertyOptional({ type: [UAOrigin] })
  origins?: UAOrigin[]
}
