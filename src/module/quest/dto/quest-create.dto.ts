import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsObject } from 'class-validator'
import { QuestRawData } from '../interface/quest-raw-data.interface'

export class QuestCreate {
  @IsArray()
  @IsObject({ each: true })
  @ApiProperty({
    isArray: true,
    type: Object,
    description: '`api_data.api_list` of `/kcsapi/api_get_member/questlist`',
    example: [
      {
        api_no: 216,
        api_category: 2,
        api_type: 1,
        api_label_type: 2,
        api_state: 1,
        api_title: '\u6575\u8266\u968a\u4e3b\u529b\u3092\u6483\u6ec5\u305b\u3088\uff01',
        api_detail: '\u8266\u968a\u3092\u51fa\u6483\u3055\u305b\u3001\u6575\u8266\u968a\u300c\u4e3b\u529b\u300d\u3092\u6355\u6349\uff01\u3053\u308c\u3092\u6483\u6ec5\u305b\u3088\uff01',
        api_voice_id: 0,
        api_get_material: [50, 50, 50, 50],
        api_bonus_flag: 1,
        api_progress_flag: 0,
        api_invalid_flag: 0,
      },
    ],
  })
  list: QuestRawData[]
}
