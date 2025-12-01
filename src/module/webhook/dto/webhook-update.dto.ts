import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class WebhookUpdate {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  onQuestNewSubmit?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  onQuestNewUnknown?: boolean
}
