import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'
import { ToNumber } from '../../../shared/decorator/to-number.decorator'
import { getPropertyNumberArrayDescription, QUEST_IS_MOD_DESC, QUEST_IS_SUS_DESC, QUEST_IS_VERIFIED_DESC } from '../constant/quest.constant'

export class QuestFilter {
  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({
    type: 'string',
    description: getPropertyNumberArrayDescription('api_no'),
  })
  api_no?: number[]

  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'string' })
  api_category?: number[]

  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'string' })
  api_type?: number[]

  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'string' })
  api_label_type?: number[]

  @IsOptional()
  @ApiPropertyOptional()
  api_title?: string

  @IsOptional()
  @ApiPropertyOptional()
  api_detail?: string

  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'string' })
  api_voice_id?: number[]

  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({ type: 'string' })
  api_bonus_flag?: number[]

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  has_api_select_rewards?: boolean

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional({ description: QUEST_IS_VERIFIED_DESC })
  is_verified?: boolean

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional({ description: QUEST_IS_SUS_DESC })
  is_sus?: boolean

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional({ description: QUEST_IS_MOD_DESC })
  is_mod?: boolean

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
- <code>is_verified</code>
- <code>is_sus</code>
- <code>is_mod</code>
- <code>api_no</code>
- <code>api_category</code>
- <code>api_type</code>
- <code>api_label_type</code>
- <code>api_voice_id</code>
- <code>api_bonus_flag</code>
- <code>has_api_select_rewards</code>
    `,
    examples: {
      default: {
        value: '-created_at',
        summary: 'default',
      },
      api_no: {
        value: 'api_no,-created_at',
        summary: 'api_no',
      },
    },
  })
  sort?: string[]
}
