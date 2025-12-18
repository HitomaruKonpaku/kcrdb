import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'
import { ToNumber } from '../../../shared/decorator/to-number.decorator'
import { getPropertyNumberArrayDescription } from '../../quest/constant/quest.constant'

export class AdminQuestSusResetQuery {
  @IsOptional()
  @IsInt({ each: true })
  @ToArray()
  @ToNumber()
  @ApiPropertyOptional({
    type: 'string',
    description: getPropertyNumberArrayDescription('api_no'),
  })
  api_no?: number[]
}
