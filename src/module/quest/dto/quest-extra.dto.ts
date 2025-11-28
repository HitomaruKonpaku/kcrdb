import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class QuestExtra {
  @IsOptional()
  @ApiPropertyOptional({
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
  extend?: string
}
