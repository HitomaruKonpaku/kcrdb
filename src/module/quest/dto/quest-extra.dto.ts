import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class QuestExtra {
  @IsOptional()
  @ToArray()
  @ApiPropertyOptional({
    type: 'string',
    description: `
Fields:
- <code>origins</code>
- <code>clearItems</code>
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
      clearItems: {
        value: 'clearItems',
        summary: 'clearItems',
      },
      all: {
        value: 'origins,clearItems',
        summary: 'ALL',
      },
    },
  })
  extend?: string[]
}
