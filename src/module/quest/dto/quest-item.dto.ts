import { ApiProperty } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'
import { QuestItemApi } from './quest-item-api.dto'

export class QuestItem extends BaseDto {
  @ApiProperty()
  api_quest_id: number

  @ApiProperty({ type: QuestItemApi })
  data: QuestItemApi
}
