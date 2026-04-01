import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { ToBoolean } from '../../../shared/decorator/to-boolean.decorator'
import { KcsapiExtraDto } from '../../../shared/kcsapi/dto/kcsapi-extra.dto'

export class RemodelExtraDto extends KcsapiExtraDto {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  metadata?: boolean
}
