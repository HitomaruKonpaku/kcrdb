import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class QuestItemExtra {
  @IsOptional()
  @ApiPropertyOptional({
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
  extend?: string
}
