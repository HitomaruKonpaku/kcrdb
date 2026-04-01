import { ApiProperty } from '@nestjs/swagger'

export class MstBaseDto {
  @ApiProperty()
  api_id: number

  @ApiProperty()
  api_name: string
}
