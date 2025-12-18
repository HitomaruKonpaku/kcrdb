import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class QuestItemExtra {
  @IsOptional()
  @ToArray()
  @ApiPropertyOptional({
    type: 'string',
    description: `
Fields:
- <code>origins</code>
    `,
    default: null,
    examples: {
      default: {
        value: null,
        summary: 'default',
      },
      origins: {
        value: 'origins',
        summary: 'origins',
      },
    },
  })
  extend?: string[]
}
