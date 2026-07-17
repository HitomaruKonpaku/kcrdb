import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class EventRewardItem {
  @ApiProperty()
  api_type: number

  @ApiProperty()
  api_id: number

  @ApiProperty()
  api_value: number

  @ApiPropertyOptional()
  api_slot_level?: number
}
