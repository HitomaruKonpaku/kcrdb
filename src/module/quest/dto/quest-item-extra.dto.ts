import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { ToArray } from '../../../shared/decorator/to-array.decorator'

export class QuestItemExtra {
  @IsOptional()
  @ToArray()
  @ApiPropertyOptional({
    description: `
Fields:
- <code>origins</code>
    `.trim(),
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
