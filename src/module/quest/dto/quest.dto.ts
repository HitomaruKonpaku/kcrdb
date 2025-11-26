import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BaseDto } from '../../../shared/base/base.dto'
import { UAOrigin } from '../../user-agent/dto/ua-origin.dto'
import { QUEST_IS_MOD_DESC, QUEST_IS_SUS_DESC, QUEST_IS_VERIFIED_DESC } from '../constant/quest.constant'
import { QuestApi } from './quest-api.dto'

export class Quest extends BaseDto {
  @ApiProperty({ type: QuestApi })
  data: QuestApi

  @ApiPropertyOptional()
  hit?: number

  @ApiPropertyOptional({ default: false, description: QUEST_IS_VERIFIED_DESC })
  isVerified?: boolean

  @ApiPropertyOptional({ default: false, description: QUEST_IS_SUS_DESC })
  isSus?: boolean

  @ApiPropertyOptional({ default: false, description: QUEST_IS_MOD_DESC })
  isMod?: boolean

  @ApiPropertyOptional({ type: [UAOrigin] })
  origins?: UAOrigin[]
}
