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
}
