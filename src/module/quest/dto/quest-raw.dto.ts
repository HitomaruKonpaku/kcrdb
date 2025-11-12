import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class QuestRaw {
  @ApiProperty()
  api_no: number

  @ApiProperty()
  api_category: number

  @ApiProperty()
  api_type: number

  @ApiProperty()
  api_label_type: number

  @ApiPropertyOptional()
  api_state?: number

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

  @ApiPropertyOptional({ type: Number, isArray: true })
  api_select_rewards?: number[]

  @ApiPropertyOptional()
  api_bonus_flag?: number

  @ApiPropertyOptional()
  api_progress_flag?: number

  @ApiPropertyOptional()
  api_invalid_flag?: number
}
