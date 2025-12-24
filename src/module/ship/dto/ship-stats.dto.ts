import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { KcsapiDto } from '../../../shared/kcsapi/kcsapi.dto'
import { ShipStatsType } from '../enum/ship-stats.enum'

export class ShipStats extends KcsapiDto {
  @ApiProperty()
  data: Record<string, any>

  @ApiProperty({ enum: ShipStatsType })
  type: ShipStatsType

  @ApiProperty()
  api_ship_id: number

  @ApiProperty()
  api_lv: number

  @ApiPropertyOptional({ type: [Number] })
  api_slot_mst_id?: number[]

  @ApiProperty()
  slot_empty: boolean

  @ApiPropertyOptional()
  estimation?: Record<string, any>
}
