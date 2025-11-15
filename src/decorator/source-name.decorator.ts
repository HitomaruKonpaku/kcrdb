import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

const KEY = 'source-name'

export const SourceName = (name: string) => SetMetadata(KEY, name)

export const parseSourceName = (reflector: Reflector, context: ExecutionContext) => reflector
  .getAllAndOverride<string>(
    KEY,
    [
      context.getHandler(),
      context.getClass(),
    ],
  )
