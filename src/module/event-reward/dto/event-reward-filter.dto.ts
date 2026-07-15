import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class EventRewardFilter {
  @ApiPropertyNumberArray('world')
  world?: number[]

  @ApiPropertyNumberArray('map')
  map?: number[]

  @ApiPropertyNumberArray('difficulty')
  difficulty?: number[]

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
- <code>world</code>
- <code>map</code>
- <code>difficulty</code>
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
