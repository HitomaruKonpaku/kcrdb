import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsObject, Max, Min } from 'class-validator'

export class RemodelSlotlistDetailCreate {
  @IsInt()
  @ApiProperty()
  flag_ship_id: number

  @IsInt()
  @ApiProperty()
  helper_ship_id: number

  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty({ minimum: 0, maximum: 6 })
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
