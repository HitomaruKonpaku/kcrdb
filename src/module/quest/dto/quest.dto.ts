import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'
import { QuestApi } from './quest-api.dto'

export class Quest extends BaseDto {
  @ApiProperty({ type: QuestApi })
  data: QuestApi

  @ApiPropertyOptional()
  hit?: number
}
