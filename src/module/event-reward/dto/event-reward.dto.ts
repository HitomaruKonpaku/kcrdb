import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger'
import { KcsapiDto } from '../../../shared/kcsapi/dto/kcsapi.dto'
import { EventRewardItem } from './event-reward-item.dto'
import { EventRewardSelectItem } from './event-reward-select-item.dto'

@ApiExtraModels(EventRewardSelectItem)
export class EventReward extends KcsapiDto {
  @ApiProperty({ example: 62 })
  world: number

  @ApiProperty({ example: 1 })
  map: number

  @ApiProperty({ example: 4 })
  difficulty: number

  @ApiProperty({
    type: [EventRewardItem],
    example: [
      { api_type: 1, api_id: 57, api_value: 1 },
      { api_type: 1, api_id: 54, api_value: 3 },
      { api_type: 7, api_id: 141, api_value: 1 },
      { api_type: 7, api_id: 142, api_value: 1 },
      { api_type: 7, api_id: 143, api_value: 1 },
      { api_type: 3, api_id: 379, api_value: 1 },
      { api_type: 3, api_id: 575, api_value: 1, api_slot_level: 1 },
      { api_type: 3, api_id: 572, api_value: 1, api_slot_level: 2 },
    ],
  })
  api_get_eventitem: EventRewardItem[]

  @ApiPropertyOptional({
    additionalProperties: {
      type: 'array',
      items: { $ref: getSchemaPath(EventRewardSelectItem) },
    },
    example: {
      141: [
        { api_item_no: 1, api_type: 1, api_id: 905, api_value: 1 },
        { api_item_no: 2, api_type: 1, api_id: 3, api_value: 45 },
      ],
      142: [
        { api_item_no: 1, api_type: 1, api_id: 104, api_value: 2 },
        { api_item_no: 2, api_type: 1, api_id: 51, api_value: 1 },
      ],
      143: [
        { api_item_no: 1, api_type: 1, api_id: 31, api_value: 4800 },
        { api_item_no: 2, api_type: 1, api_id: 59, api_value: 3 },
      ],
    },
  })
  api_select_reward_dict?: Record<string, EventRewardSelectItem[]>
}
