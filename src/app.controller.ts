import { Controller, Get, Render } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller()
@ApiTags('app')
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
