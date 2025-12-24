import { Injectable } from '@nestjs/common'
import { BaseEntity } from '../../../shared/base/base.entity'
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

  public async attachOrigins(
    entities: BaseEntity[],
    sourceName: string,
    mapToProperty = 'origins',
  ) {
    if (!entities?.length || !sourceName || !mapToProperty) {
      return
    }

    const items = await this.repository.findBySource(
      sourceName,
      entities.map((v) => v.id).filter((v) => v),
    )

    entities.forEach((entity) => {
      // eslint-disable-next-line no-param-reassign
      entity[mapToProperty] = items
        .filter((v) => v.sourceId === entity.id)
        .map((v) => {
          const obj: Partial<UserAgent> = { ...v }
          delete obj.sourceId
          return obj
        })
    })
  }
}
