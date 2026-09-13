import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMaxSize, IsOptional } from 'class-validator'
import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class QuestItemFilter {
  @ApiPropertyNumberArray()
  @ArrayMaxSize(2)
  hit?: number[]

  @ApiPropertyNumberArray('api_quest_id')
  api_quest_id?: number[]

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
- <code>api_quest_id</code>
- <code>api_select_no</code>
    `,
    examples: {
      default: {
        value: '-created_at',
        summary: 'default',
      },
      api_no: {
        value: 'api_quest_id,api_select_no',
        summary: 'api_quest_id',
      },
    },
  })
  sort?: string[]
}
