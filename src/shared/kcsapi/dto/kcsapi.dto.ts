import { ApiPropertyOptional } from '@nestjs/swagger'
import { BaseDto } from '../../base/base.dto'
import { ApiPropertyKcsapiState } from '../kcsapi-state.decorator'
import { KcsapiState } from '../kcsapi-state.enum'

export abstract class KcsapiDto extends BaseDto {
  @ApiPropertyKcsapiState()
  state?: KcsapiState

  @ApiPropertyOptional()
  hit?: number
}
