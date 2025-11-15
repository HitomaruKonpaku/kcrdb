import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

const KEY = 'key-delete'

export const KeyDelete = (...keys: string[]) => SetMetadata(KEY, keys)

export const parseKeyDelete = (reflector: Reflector, context: ExecutionContext) => reflector
  .getAllAndOverride<string[]>(
    KEY,
    [
      context.getHandler(),
      context.getClass(),
    ],
  ) || []
