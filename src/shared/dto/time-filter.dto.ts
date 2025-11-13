import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'

export class TimeFilterDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'ISO format',
    default: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  })
  before?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'ISO format',
    default: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  })
  after?: Date
}
