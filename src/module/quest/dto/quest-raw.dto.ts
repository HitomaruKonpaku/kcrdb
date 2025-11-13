import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { QuestReward } from './quest-reward.dto'

export class QuestRaw {
  @ApiProperty()
  api_no: number

  @ApiProperty()
  api_category: number

  @ApiProperty()
  api_type: number

  @ApiProperty()
  api_label_type: number

  @ApiProperty()
  api_title: string

  @ApiProperty()
  api_detail: string

  @ApiPropertyOptional()
  api_voice_id?: number

  @ApiPropertyOptional()
  api_lost_badges?: number

  @ApiPropertyOptional({ type: Number, isArray: true, default: [0, 0, 0, 0] })
  api_get_material?: number[]

  @ApiPropertyOptional({ type: QuestReward, isArray: true })
  api_select_rewards?: QuestReward[]

  @ApiPropertyOptional()
  api_bonus_flag?: number

  // #region user related so can prob ignore

  @ApiPropertyOptional()
  api_state?: number

  @ApiPropertyOptional()
  api_progress_flag?: number

  @ApiPropertyOptional()
  api_invalid_flag?: number

  // #endregion
}
