import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator'

export class RemodelSlotCreate {
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

  @IsInt()
  @ApiProperty()
  api_id: number

  @IsInt()
  @ApiProperty()
  api_slot_id: number

  @IsInt()
  @ApiProperty()
  api_slot_level: number

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  api_certain_flag?: number

  @IsObject()
  @ApiProperty()
  data: object
}
