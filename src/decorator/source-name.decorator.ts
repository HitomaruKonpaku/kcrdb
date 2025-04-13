import { SetMetadata } from '@nestjs/common'

export const SOURCE_NAME = 'source-name'

export const SourceName = (name: string) => SetMetadata(SOURCE_NAME, name)
