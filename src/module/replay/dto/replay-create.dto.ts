import { ApiProperty } from '@nestjs/swagger'
import { IsObject } from 'class-validator'

export class ReplayCreate {
  @IsObject()
  @ApiProperty()
  data: Record<string, any>
}
