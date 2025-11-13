import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'

export class TimeFilterDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: Date,
    description: 'ISO format',
    default: new Date(Date.now() + 24 * 3600 * 1000)
      .toISOString()
      .replace(/\.\d{3}/, ''),
  })
  before?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: Date,
    description: 'ISO format',
    default: new Date(Date.now() - 24 * 3600 * 1000)
      .toISOString()
      .replace(/\.\d{3}/, ''),
  })
  after?: Date
}
