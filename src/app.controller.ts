import { Controller, Get, Render } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { AppService } from './app.service'

@Controller()
@ApiExcludeController()
@SkipThrottle()
export class AppController {
  constructor(
    private readonly service: AppService,
  ) { }

  @Get()
  @Render('index')
  root() {
    return {}
  }
}
