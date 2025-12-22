import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { ToArray } from '../decorator/to-array.decorator'
import { ToNumber } from '../decorator/to-number.decorator'
import { KcsapiState } from './kcsapi-state.enum'

export const ApiPropertyKcsapiStateArray = () => applyDecorators(
  IsOptional(),
  IsEnum(KcsapiState, { each: true }),
  ToNumber(),
  ToArray(),
  ApiPropertyOptional({
    type: 'string',
    description: `
<code>0=NEW</code>
<code>1=VERIFIED</code>
<code>2=SUS</code>
<code>3=MODDED</code>
    `,
  }),
)
