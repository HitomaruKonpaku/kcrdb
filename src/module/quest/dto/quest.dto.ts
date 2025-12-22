import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { KcsapiDto } from '../../../shared/kcsapi/kcsapi.dto'
import { UAOrigin } from '../../user-agent/dto/ua-origin.dto'
import { QuestApi } from './quest-api.dto'

export class Quest extends KcsapiDto {
  @ApiProperty({ type: QuestApi })
  data: QuestApi

  @ApiPropertyOptional({ type: [UAOrigin] })
  origins?: UAOrigin[]
}
