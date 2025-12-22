import { ApiPropertyNumberArray } from '../../../shared/decorator/api-property-number-array.decorator'

export class AdminQuestSusResetQuery {
  @ApiPropertyNumberArray('api_no')
  api_no?: number[]
}
