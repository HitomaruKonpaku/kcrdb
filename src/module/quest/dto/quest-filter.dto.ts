import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'

export class QuestFilter {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_no?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_category?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_type?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_label_type?: number

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  has_api_select_rewards?: boolean
}
