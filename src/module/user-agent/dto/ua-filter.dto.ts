import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UAFilter {
  @IsOptional()
  @ApiPropertyOptional()
  query?: string

  @IsOptional()
  @ApiPropertyOptional()
  raw?: string

  @IsOptional()
  @ApiPropertyOptional()
  origin?: string

  @ApiPropertyOptional()
  x_origin?: string

  @IsOptional()
  @ApiPropertyOptional()
  x_version?: string
}
