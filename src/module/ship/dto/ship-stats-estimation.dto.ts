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
    description: 'ASW',
    minItems: 5,
    maxItems: 5,
  })
  tais?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ApiPropertyOptional({
    type: [Number],
    description: 'EVA',
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
    description: 'LOS',
    minItems: 5,
    maxItems: 5,
  })
  saku?: number[]
}
