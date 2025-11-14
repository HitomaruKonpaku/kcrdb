import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

export class QuestItemFilter {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  api_quest_id?: number
}
