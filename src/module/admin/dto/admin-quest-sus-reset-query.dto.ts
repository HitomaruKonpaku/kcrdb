import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class AdminQuestSusResetQuery {
  @IsOptional()
  @ApiPropertyOptional()
  api_no?: string
}
