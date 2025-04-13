import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { IdUtil } from '../../../shared/util/id.util'
import { UserAgent } from '../model/user-agent.entity'

@Injectable()
export class UserAgentRepository extends BaseRepository<UserAgent> {
  constructor(
    @InjectRepository(UserAgent)
    public readonly repository: Repository<UserAgent>,
  ) {
    super(repository)
  }

  public async create(data: Partial<UserAgent>) {
    const res = await this.repository.upsert(
      {
        ...data,
        id: IdUtil.generate(),
      },
      {
        conflictPaths: ['sourceName', 'sourceId'],
        skipUpdateIfNoValuesChanged: true,
      },
    )
    return res
  }
}
