/* eslint-disable import/no-extraneous-dependencies */

import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { Logger } from '../shared/logger'

@Injectable()
export class SwaggerLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/docs') {
      const method = String(req.method).toUpperCase().padStart(6, ' ')
      this.logger.debug(`${method} --> ${req.path} | ${JSON.stringify({
        ip: req.ip,
        ua: req.get('User-Agent'),
      })}`)
    }

    next()
  }
}
