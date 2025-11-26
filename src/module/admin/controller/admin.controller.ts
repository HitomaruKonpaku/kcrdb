import { Controller, HttpCode, Post } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { Throttle, seconds } from '@nestjs/throttler'
import { AdminService } from '../service/admin.service'

@Controller('admin')
@ApiExcludeController()
export class AdminController {
  constructor(
    private readonly service: AdminService,
  ) { }

  @Post('quest/verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 1, ttl: seconds(60) } })
  verifyQuest() {
    return this.service.verifyQuest()
  }

  @Post('quest/sus/confirm')
  @HttpCode(200)
  @Throttle({ default: { limit: 1, ttl: seconds(60) } })
  confirmSusQuest() {
    return this.service.confirmSusQuest()
  }

  @Post('quest/sus/reset')
  @HttpCode(200)
  @Throttle({ default: { limit: 1, ttl: seconds(60) } })
  resetSusQuest() {
    return this.service.resetSusQuest()
  }
}
