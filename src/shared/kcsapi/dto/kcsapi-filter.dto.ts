import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMaxSize } from 'class-validator'
import { ApiPropertyNumberArray } from '../../decorator/api-property-number-array.decorator'
import { ApiPropertyKcsapiStateArray } from '../kcsapi-state-array.decorator'
import { KcsapiState } from '../kcsapi-state.enum'

export class KcsapiFilterDto {
  @ApiPropertyKcsapiStateArray()
  state?: KcsapiState[]

  @ApiPropertyOptional({
    description: `
- <code>hit=1</code> = <code>hit <= 1</code>
- <code>hit=1,3</code> = <code>1 <= hit <= 3</code>
    `,
  })
  @ApiPropertyNumberArray()
  @ArrayMaxSize(2)
  hit?: number[]
}
