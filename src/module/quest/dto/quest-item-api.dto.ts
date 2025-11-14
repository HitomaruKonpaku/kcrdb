import { ApiProperty } from '@nestjs/swagger'
import { QuestItemBonus } from './quest-item-bonus.dto'

export class QuestItemApi {
  @ApiProperty({ type: [Number], default: [0, 0, 0, 0] })
  api_material: number[]

  @ApiProperty()
  api_bounus_count: number

  @ApiProperty({ type: [QuestItemBonus] })
  api_bounus: QuestItemBonus[]
}
