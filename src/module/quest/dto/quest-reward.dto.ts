import { ApiProperty } from '@nestjs/swagger'

export class QuestReward {
  @ApiProperty()
  api_no: number

  @ApiProperty()
  api_kind: number

  @ApiProperty()
  api_mst_id: number

  @ApiProperty()
  api_count: number
}
