/* eslint-disable no-param-reassign */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'
import { parseKeyDelete } from '../decorator/key-delete.decorator'

@Injectable()
export class DataKeyDeleteInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (typeof value === 'object') {
          const keys = parseKeyDelete(this.reflector, context)
          keys.forEach((key) => {
            delete value[key]
          })
        }
        return value
      }),
    )
  }
}
