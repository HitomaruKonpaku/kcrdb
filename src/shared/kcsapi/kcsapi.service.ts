import { ModuleRef } from '@nestjs/core'
import { UserAgentService } from '../../module/user-agent/service/user-agent.service'
import { BaseRepository } from '../base/base.repository'
import { BaseService } from '../base/base.service'
import { ObjectUtil } from '../util/object.util'
import { KcsapiEntity } from './kcsapi.entity'

export abstract class KcsapiService<E extends KcsapiEntity<any>, R extends BaseRepository<E>> extends BaseService<E, R> {
  protected readonly userAgentService: UserAgentService

  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository)
    this.userAgentService = moduleRef.get(UserAgentService, { strict: false })
  }

  public get tableName() {
    return this.repository.repository.metadata.tableName
  }

  public async createOneWithHashFields(
    body: Record<string, any>,
    hashFields: string[],
  ) {
    const hash = ObjectUtil.hash(body, hashFields)
    let res = await this.repository.findOneBy({ hash } as any)
    if (res) {
      res.hash = hash
      return res
    }

    const tmp: any = {
      ...body,
      hash,
    }

    res = await this.insertLoop(tmp)
    res.hash = hash
    return res
  }

  public async applyJoin(
    entities: E[],
    extra?: { extend?: string[] },
  ) {
    if (!extra?.extend?.length) {
      return
    }

    if (extra.extend.includes('origins')) {
      await this.userAgentService.attachOrigins(entities, this.tableName)
    }
  }
}
