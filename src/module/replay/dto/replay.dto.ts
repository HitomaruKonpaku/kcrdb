import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'

export class Replay extends BaseDto {
  @ApiProperty()
  data: Record<string, any>

  @ApiPropertyOptional()
  hit?: number
}
