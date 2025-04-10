import { ApiProperty } from '@nestjs/swagger'

export class BaseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  isActive?: boolean

  @ApiProperty()
  createdAt?: Date

  @ApiProperty()
  updatedAt?: Date
}
