import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { KcsapiDto } from '../../../shared/kcsapi/dto/kcsapi.dto'
import { UAOrigin } from '../../user-agent/dto/ua-origin.dto'
import { QuestItemApi } from './quest-item-api.dto'

export class QuestItem extends KcsapiDto {
  @ApiProperty({ type: QuestItemApi })
  data: QuestItemApi

  @ApiProperty()
  api_quest_id: number

  @ApiPropertyOptional({ type: [Number] })
  api_select_no?: number[]

  @ApiPropertyOptional({ type: [UAOrigin] })
  origins?: UAOrigin[]
}
