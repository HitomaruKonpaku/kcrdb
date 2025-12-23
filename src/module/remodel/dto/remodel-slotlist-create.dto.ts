import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsObject, Max, Min } from 'class-validator'

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
  @ApiProperty({ minimum: 0, maximum: 6 })
  day: number

  @IsArray()
  @IsObject({ each: true })
  @ApiProperty({ type: [Object] })
  data: Record<string, any>[]
}
