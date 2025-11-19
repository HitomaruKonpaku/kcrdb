import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UAOrigin {
  @ApiProperty()
  raw: string

  @ApiPropertyOptional()
  origin?: string

  @ApiPropertyOptional()
  xOrigin?: string

  @ApiPropertyOptional()
  xVersion?: string

  @ApiPropertyOptional()
  hit?: number
}
