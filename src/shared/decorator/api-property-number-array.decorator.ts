import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'
import { ToArray } from './to-array.decorator'
import { ToNumber } from './to-number.decorator'

export const ApiPropertyNumberArray = (key?: string) => applyDecorators(
  IsOptional(),
  IsInt({ each: true }),
  ToNumber(),
  ToArray(),
  ApiPropertyOptional({
    type: 'string',
    description: !key
      ? ''
      : `
<code>${key}=1</code>
<code>${key}=1,2</code>
<code>${key}=1&${key}=2</code>
    `,
  }),
)
