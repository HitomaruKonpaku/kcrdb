import { ApiProperty } from '@nestjs/swagger'

export class QuestItemBonusItem {
  @ApiProperty()
  api_id: number

  @ApiProperty()
  api_name: string
}
