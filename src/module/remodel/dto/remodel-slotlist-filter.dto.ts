import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class RemodelSlotlistFilter {
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

  @IsOptional()
  @ToArray()
  @ApiPropertyOptional({
    type: 'string',
    description: `
Order by fields, separated by comma (<code>,</code>)
<br>
Default <code>ASC</code>, add <code>-</code> for <code>DESC</code>
<br>
Fields:
- <code>created_at</code>
- <code>updated_at</code>
- <code>hit</code>
    `,
    examples: {
      default: {
        value: '-created_at',
        summary: 'default',
      },
    },
  })
  sort?: string[]
}
