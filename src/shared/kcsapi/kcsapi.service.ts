import { BaseRepository } from '../base/base.repository'
import { BaseService } from '../base/base.service'
import { ObjectUtil } from '../util/object.util'
import { KcsapiEntity } from './kcsapi.entity'

export abstract class KcsapiService<E extends KcsapiEntity<any>, R extends BaseRepository<E>> extends BaseService<E, R> {
  constructor(
    public readonly repository: R,
  ) {
    super(repository)
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
}
