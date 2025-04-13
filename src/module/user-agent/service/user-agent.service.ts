import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { Logger } from '../../../shared/logger'
import { UserAgent } from '../model/user-agent.entity'
import { UserAgentRepository } from '../repository/user-agent.repository'

@Injectable()
export class UserAgentService extends BaseService<UserAgent, UserAgentRepository> {
  private readonly logger = new Logger(UserAgentService.name)

  constructor(
    public readonly repository: UserAgentRepository,
  ) {
    super(repository)
  }

  public async create(data: Partial<UserAgent>) {
    try {
      const res = await this.repository.create(data)
      return res
    } catch (error) {
      this.logger.error(`create: ${error.message}`)
      return null
    }
  }
}
