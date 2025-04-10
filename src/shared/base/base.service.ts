import { NotFoundException } from '@nestjs/common'
import { DeepPartial } from 'typeorm'
import { BaseEntity } from './base.entity'
import { BaseRepository } from './base.repository'

export abstract class BaseService<E extends BaseEntity, R extends BaseRepository<E>> {
  constructor(
    public readonly repository: R,
  ) { }

  public async save(data: DeepPartial<E>) {
    const res = await this.repository.save(data)
    return res
  }

  public async findOneById(id: E['id']) {
    const res = await this.repository.findOneById(id)
    if (!res) {
      throw new NotFoundException()
    }
    return res
  }
}
