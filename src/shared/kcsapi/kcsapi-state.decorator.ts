import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { ToNumber } from '../decorator/to-number.decorator'
import { KcsapiState } from './kcsapi-state.enum'

export const ApiPropertyKcsapiState = () => applyDecorators(
  IsOptional(),
  IsEnum(KcsapiState),
  ToNumber(),
  ApiPropertyOptional({
    enum: KcsapiState,
    description: `
<code>0=NEW</code>
<code>1=VERIFIED</code>
<code>2=SUS</code>
<code>3=MODDED</code>
    `,
  }),
)
