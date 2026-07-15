import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsInt, IsObject, IsOptional } from 'class-validator'
import { APIGetEventitem, APIEventSelectReward } from '../../../shared/kcsapi/interface/kcsapi.interface'

export class EventRewardCreate {
  @IsInt()
  @ApiProperty()
  world: number

  @IsInt()
  @ApiProperty()
  map: number

  @IsInt()
  @ApiProperty()
  difficulty: number

  @IsArray()
  @IsObject({ each: true })
  @ApiProperty({
    type: [Object],
    description: '<code>api_get_eventitem</code> of <code>/kcsapi/api_req_sortie/battleresult</code> or <code>/kcsapi/api_req_combined_battle/battleresult</code>',
  })
  api_get_eventitem: APIGetEventitem[]

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    type: Object,
    description: '<code>api_select_reward_dict</code> of <code>/kcsapi/api_req_sortie/battleresult</code> or <code>/kcsapi/api_req_combined_battle/battleresult</code>',
  })
  api_select_reward_dict?: Record<string, APIEventSelectReward[]>
}
