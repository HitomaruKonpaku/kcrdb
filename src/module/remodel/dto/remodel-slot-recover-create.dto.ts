import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Max, Min } from 'class-validator'
import { RemodelCreate } from './remodel-create.dto'

export class RemodelSlotRecoverCreate extends RemodelCreate {
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

  @IsInt()
  @ApiProperty()
  api_dev_num: number

  @IsInt()
  @ApiProperty()
  api_recover_flag: number
}
