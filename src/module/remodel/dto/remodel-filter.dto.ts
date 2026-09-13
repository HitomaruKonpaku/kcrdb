import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'
import { KcsapiFilterDto } from '../../../shared/kcsapi/dto/kcsapi-filter.dto'

export class RemodelFilter extends KcsapiFilterDto {
  @ApiPropertyNumberArray('flag_ship_id')
  flag_ship_id?: number[]

  @ApiPropertyNumberArray('helper_ship_id')
  helper_ship_id?: number[]

  @ApiPropertyNumberArray('day')
  day?: number[]

  @ApiPropertyNumberArray('api_id')
  api_id?: number[]

  @ApiPropertyNumberArray('api_slot_id')
  api_slot_id?: number[]
}
