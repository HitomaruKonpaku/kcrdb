import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsInt, IsObject, IsOptional } from 'class-validator'
import { QuestItemApiRoot } from '../interface/quest-item-api.interface'

export class QuestItemCreate {
  @IsInt()
  @ApiProperty({
    description: 'Quest <code>api_no</code>',
    example: 216,
  })
  api_quest_id: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiPropertyOptional({
    type: [Number],
    description: `
Array of <code>api_select_no[N]</code> params from original request
<br><br>
For example if request params is <code>api_token=...&api_verno=1&api_quest_id=374&api_select_no=1&api_select_no2=2</code>,
<br>
then this param <code>api_select_no</code> = <code>[1,2]</code>
    `,
  })
  api_select_no?: number[]

  @IsObject()
  @ApiProperty({
    type: Object,
    description: '<code>api_data</code> of <code>/kcsapi/api_req_quest/clearitemget</code>',
    example: {
      api_material: [
        50,
        50,
        50,
        50,
      ],
      api_bounus_count: 2,
      api_bounus: [
        {
          api_type: 1,
          api_count: 1,
          api_item: {
            api_id: 7,
            api_name: '',
          },
        },
        {
          api_type: 1,
          api_count: 1,
          api_item: {
            api_id: 6,
            api_name: '',
          },
        },
      ],
    },
  })
  data: QuestItemApiRoot
}
