import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'
import { ToNumber } from '../../../shared/decorator/to-number.decorator'

export class QuestItemFilter {
  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'number' })
  api_quest_id?: number[]

  @IsOptional()
  @ApiPropertyOptional({
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
  sort?: string
}
