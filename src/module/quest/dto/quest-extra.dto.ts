import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class QuestExtra {
  @IsOptional()
  @ApiPropertyOptional({
    description: `
Fields:
- <code>clearItems</code>
- <code>origins</code>
    `,
    default: null,
    examples: {
      default: {
        value: null,
        summary: 'default',
      },
      clearItems: {
        value: 'clearItems',
        summary: 'clearItems',
      },
      origins: {
        value: 'origins',
        summary: 'origins',
      },
      all: {
        value: 'clearItems,origins',
        summary: 'ALL',
      },
    },
  })
  extend?: string
}
