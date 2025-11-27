import { ApiProperty } from '@nestjs/swagger'

export class TokenResult {
  @ApiProperty()
  token: string
}
