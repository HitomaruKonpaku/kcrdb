import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'

function getDefaultDate(offset = 0) {
  const d = new Date(Date.now() + offset)
  d.setMinutes(0)
  d.setSeconds(0)
  const s = d.toISOString().replace(/\.\d{3}/, '')
  return s
}

export class TimeFilterDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: Date,
    description: 'ISO format',
    default: getDefaultDate(1 * 24 * 3600 * 1000),
  })
  before?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: Date,
    description: 'ISO format',
    default: getDefaultDate(-1 * 24 * 3600 * 1000),
  })
  after?: Date
}
