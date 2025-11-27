import { Controller, HttpCode, Post, Query, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Throttle, seconds } from '@nestjs/throttler'
import { API_KEY_HEADER_NAME } from '../../../constant/common.constant'
import { QUEST_IS_VERIFIED_DESC } from '../../quest/constant/quest.constant'
import { TokenGuard } from '../../token/guard/token.guard'
import { AdminQuestSusResetQuery } from '../dto/admin-quest-sus-reset-query.dto'
import { AdminService } from '../service/admin.service'

@Controller('admin')
@UseGuards(TokenGuard)
@ApiTags('admin')
@ApiSecurity(API_KEY_HEADER_NAME)
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
export class AdminController {
  constructor(
    private readonly service: AdminService,
  ) { }

  @Post('quest/verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 1, ttl: seconds(1) } })
  @ApiOperation({ description: QUEST_IS_VERIFIED_DESC })
  verifyQuest() {
    return this.service.verifyQuest()
  }

  @Post('quest/sus/confirm')
  @HttpCode(200)
  @ApiOperation({ description: 'Confirm quest <code>is_mod</code>' })
  confirmSusQuest() {
    return this.service.confirmSusQuest()
  }

  @Post('quest/sus/reset')
  @HttpCode(200)
  @ApiOperation({ description: 'Reset quest <code>is_sus</code>/<code>is_mod</code>' })
  resetSusQuest(
    @Query() q: AdminQuestSusResetQuery,
  ) {
    return this.service.resetSusQuest(q)
  }
}
