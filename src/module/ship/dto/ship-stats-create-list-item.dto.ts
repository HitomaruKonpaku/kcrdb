import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { ShipStatsEstimation } from './ship-stats-estimation.dto'

export class ShipStatsCreateListItem {
  @IsInt()
  @ApiProperty()
  api_ship_id: number

  @IsInt()
  @ApiProperty()
  api_lv: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiPropertyOptional({ type: [Number] })
  api_slot_mst_id?: number[]

  @IsBoolean()
  @ApiProperty()
  slot_empty: boolean

  @IsObject()
  @ApiProperty()
  data: Record<string, any>

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ShipStatsEstimation)
  @ApiPropertyOptional()
  estimation?: ShipStatsEstimation
}
