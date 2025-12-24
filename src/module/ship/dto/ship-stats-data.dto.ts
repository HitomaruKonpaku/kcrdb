import { ApiPropertyOptional } from '@nestjs/swagger'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsOptional } from 'class-validator'

export class ShipStatsData {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ApiPropertyOptional({
    type: [Number],
    description: 'ASW',
    minItems: 3,
    maxItems: 3,
  })
  api_taisen?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiPropertyOptional({
    type: [Number],
    description: 'EVA',
    minItems: 2,
    maxItems: 2,
  })
  api_kaihi?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiPropertyOptional({
    type: [Number],
    description: 'LOS',
    minItems: 2,
    maxItems: 2,
  })
  api_sakuteki?: number[]

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Min ASW from picture_book',
  })
  api_tais?: number

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Min EVA from picture_book',
  })
  api_kaih?: number
}
