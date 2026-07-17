import { ApiProperty } from '@nestjs/swagger'

export class EventRewardSelectItem {
  @ApiProperty()
  api_item_no: number

  @ApiProperty()
  api_type: number

  @ApiProperty()
  api_id: number

  @ApiProperty()
  api_value: number
}
