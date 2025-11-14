import { ApiProperty } from '@nestjs/swagger'
import { QuestItemBonusItem } from './quest-item-bonus-item.dto'

export class QuestItemBonus {
  @ApiProperty()
  api_type: number

  @ApiProperty()
  api_count: number

  @ApiProperty({ type: QuestItemBonusItem })
  api_item: QuestItemBonusItem
}
