import { Controller, Get, Render } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { AppService } from './app.service'

@Controller()
@ApiTags('app')
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
