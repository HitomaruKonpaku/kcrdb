import { ApiProperty } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'

export class Simulator extends BaseDto {
  @ApiProperty()
  data: string
}
