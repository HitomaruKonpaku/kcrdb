import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsOptional } from 'class-validator'

export class ShipStatsEstimation {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ApiPropertyOptional({
    type: [Number],
    description: 'evasion',
    minItems: 5,
    maxItems: 5,
  })
  houk?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ApiPropertyOptional({
    type: [Number],
    description: 'los',
    minItems: 5,
    maxItems: 5,
  })
  saku?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ApiPropertyOptional({
    type: [Number],
    description: 'asw',
    minItems: 5,
    maxItems: 5,
  })
  tais?: number[]
}
