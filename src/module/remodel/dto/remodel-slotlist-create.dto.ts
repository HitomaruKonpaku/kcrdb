import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsObject } from 'class-validator'
import { RemodelCreate } from './remodel-create.dto'

export class RemodelSlotlistCreate extends RemodelCreate {
  @IsArray()
  @IsObject({ each: true })
  @ApiProperty({ type: [Object] })
  data: Record<string, any>[]
}
