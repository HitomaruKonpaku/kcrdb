import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator'
import { RemodelCreate } from './remodel-create.dto'

export class RemodelSlotCreate extends RemodelCreate {
  @IsInt()
  @ApiProperty()
  api_id: number

  @IsInt()
  @ApiProperty()
  api_slot_id: number

  @IsInt()
  @Min(0)
  @Max(10)
  @ApiProperty({ minimum: 0, maximum: 10 })
  api_slot_level: number

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  api_certain_flag?: number

  @IsObject()
  @ApiProperty({ type: Object })
  data: Record<string, any>
}
