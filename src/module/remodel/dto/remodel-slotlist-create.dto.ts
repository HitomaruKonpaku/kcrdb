import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsObject, Max, Min } from 'class-validator'

export class RemodelSlotlistCreate {
  @IsInt()
  @ApiProperty()
  flag_ship_id: number

  @IsInt()
  @ApiProperty()
  helper_ship_id: number

  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty()
  day: number

  @IsObject({ each: true })
  @ApiProperty({ type: [Object] })
  data: object
}
