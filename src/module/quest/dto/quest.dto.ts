import { ApiProperty } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'
import { QuestRaw } from './quest-raw.dto'

export class Quest extends BaseDto {
  @ApiProperty({ type: QuestRaw })
  data: QuestRaw
}
