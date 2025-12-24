import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'
import { ShipStatsType } from '../enum/ship-stats.enum'

export class ShipStatsFilter {
  @IsOptional()
  @IsEnum(ShipStatsType)
  @ApiPropertyOptional({ enum: ShipStatsType })
  type?: ShipStatsType

  @ApiPropertyNumberArray('api_ship_id')
  api_ship_id?: number[]

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  slot_empty?: boolean
}
