import { Controller, HttpCode, Post, Query } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { Throttle, seconds } from '@nestjs/throttler'
import { AdminQuestSusResetQuery } from '../dto/admin-quest-sus-reset-query.dto'
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
  @Throttle({ default: { limit: 1, ttl: seconds(30) } })
  resetSusQuest(
    @Query() q: AdminQuestSusResetQuery,
  ) {
    return this.service.resetSusQuest(q)
  }
}
