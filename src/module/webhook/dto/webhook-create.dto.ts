import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsUrl } from 'class-validator'

export class WebhookCreate {
  @IsUrl()
  @ApiProperty()
  url: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  onQuestNewSubmit?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  onQuestNewUnknown?: boolean
}
