import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator'
import { ShipStatsType } from '../enum/ship-stats.enum'
import { ShipStatsCreateListItem } from './ship-stats-create-list-item.dto'

export class ShipStatsCreate {
  @IsEnum(ShipStatsType)
  @ApiProperty({ enum: ShipStatsType })
  type: ShipStatsType

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ShipStatsCreateListItem)
  @ApiProperty({ type: [ShipStatsCreateListItem] })
  list: ShipStatsCreateListItem[]
}
