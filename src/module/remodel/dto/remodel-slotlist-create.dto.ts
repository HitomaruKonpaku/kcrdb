import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsObject } from 'class-validator'

export class RemodelSlotlistCreate {
  @IsInt()
  @ApiProperty()
  flag_ship_id: number

  @IsInt()
  @ApiProperty()
  helper_ship_id: number

  @IsInt()
  @ApiProperty()
  day: number

  @IsObject({ each: true })
  @ApiProperty({ type: [Object] })
  data: object
}
