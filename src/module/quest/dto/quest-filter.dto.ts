import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'

export class QuestFilter {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_no?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_category?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_type?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_label_type?: number

  @IsOptional()
  @ApiPropertyOptional()
  api_title?: string

  @IsOptional()
  @ApiPropertyOptional()
  api_detail?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_voice_id?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_bonus_flag?: number

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  has_api_select_rewards?: boolean

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  is_verified?: boolean

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  is_sus?: boolean

  @IsOptional()
  @ApiPropertyOptional({
    description: `
Order by fields, separated by comma (<code>,</code>)
<br>
Default <code>ASC</code>, add <code>-</code> for <code>DESC</code>
<br>
Fields:
- <code>created_at</code>
- <code>hit</code>
- <code>is_verified</code>
- <code>is_sus</code>
- <code>api_no</code>
- <code>api_category</code>
- <code>api_type</code>
- <code>api_label_type</code>
- <code>api_voice_id</code>
- <code>api_bonus_flag</code>
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
  sort?: string
}
