import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsObject } from 'class-validator'

export class RemodelSlotlistDetailCreate {
  @IsInt()
  @ApiProperty()
  flag_ship_id: number

  @IsInt()
  @ApiProperty()
  helper_ship_id: number

  @IsInt()
  @ApiProperty()
  day: number

  @IsInt()
  @ApiProperty()
  api_id: number

  @IsInt()
  @ApiProperty()
  api_slot_id: number

  @IsInt()
  @ApiProperty()
  api_slot_level: number

  @IsObject()
  @ApiProperty()
  data: object
}
