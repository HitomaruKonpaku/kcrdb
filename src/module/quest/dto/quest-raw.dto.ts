import { ApiProperty } from '@nestjs/swagger'

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
  api_state: number

  @ApiProperty()
  api_title: string

  @ApiProperty()
  api_detail: string

  @ApiProperty()
  api_voice_id: number

  @ApiProperty({ type: Number, isArray: true, default: [0, 0, 0, 0] })
  api_get_material: number[]

  @ApiProperty()
  api_bonus_flag: number

  @ApiProperty()
  api_progress_flag: number

  @ApiProperty()
  api_invalid_flag: number
}
