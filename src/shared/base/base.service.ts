import { NotFoundException } from '@nestjs/common'
import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { IdUtil } from '../util/id.util'
import { BaseEntity } from './base.entity'
import { BaseRepository } from './base.repository'

export abstract class BaseService<E extends BaseEntity, R extends BaseRepository<E>> {
  constructor(
    public readonly repository: R,
  ) { }

  public async findOneById(id: E['id']) {
    const res = await this.repository.findOneById(id)
    if (!res) {
      throw new NotFoundException()
    }
    return res
  }

  public async save(data: DeepPartial<E>) {
    const res = await this.repository.save(data)
    return res
  }

  public async insert(data: QueryDeepPartialEntity<E>) {
    const id = IdUtil.generate()
    const res = await this.repository.insert({ ...data, id })
    return res
  }

  public async insertOrIgnore(data: QueryDeepPartialEntity<E>) {
    const id = IdUtil.generate()
    const res = await this.repository.insertOrIgnore({ ...data, id })
    return res
  }

  public async insertLoop(data: QueryDeepPartialEntity<E>) {
    let id = IdUtil.generate()

    do {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.repository.insert({ ...data, id })
        break
      } catch (error) {
        if (error.code === '23505' && error.detail && error.detail.includes('(id)')) {
          id = IdUtil.generate()
          // eslint-disable-next-line no-continue
          continue
        }
        throw error
      }
      // eslint-disable-next-line no-constant-condition
    } while (true)

    const res = await this.findOneById(id)
    return res
  }
}
