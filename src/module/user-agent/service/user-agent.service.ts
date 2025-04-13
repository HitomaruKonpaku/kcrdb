import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { UserAgent } from '../model/user-agent.entity'
import { UserAgentRepository } from '../repository/user-agent.repository'

@Injectable()
export class UserAgentService extends BaseService<UserAgent, UserAgentRepository> {
  constructor(
    public readonly repository: UserAgentRepository,
  ) {
    super(repository)
  }
}
