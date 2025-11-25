import { Controller, Post } from '@nestjs/common'
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
  @Throttle({ default: { limit: 1, ttl: seconds(60) } })
  verifyQuest() {
    return this.service.verifyQuest()
  }
}
