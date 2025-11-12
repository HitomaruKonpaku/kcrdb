import { ApiProperty } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'

export class Quest extends BaseDto {
  @ApiProperty()
  data: Record<string, any>
}
