import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAgent } from './model/user-agent.entity'
import { UserAgentRepository } from './repository/user-agent.repository'
import { UserAgentService } from './service/user-agent.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAgent,
    ]),
  ],
  providers: [
    UserAgentRepository,
    UserAgentService,
  ],
  exports: [
    UserAgentRepository,
    UserAgentService,
  ],
})
export class UserAgentModule { }
