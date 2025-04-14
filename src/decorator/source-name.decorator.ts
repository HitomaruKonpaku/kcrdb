import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const SOURCE_NAME = 'source-name'

export const SourceName = (name: string) => SetMetadata(SOURCE_NAME, name)

export const parseSourceName = (reflector: Reflector, context: ExecutionContext) => reflector
  .getAllAndOverride<string>(
    SOURCE_NAME,
    [
      context.getHandler(),
      context.getClass(),
    ],
  )
