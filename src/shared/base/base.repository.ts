import { DeepPartial, Repository } from 'typeorm'
import { BaseEntity } from './base.entity'

export abstract class BaseRepository<E extends BaseEntity> {
  constructor(
    public readonly repository: Repository<E>,
  ) { }

  public async save(data: DeepPartial<E>) {
    const res = await this.repository.save(data)
    return res
  }

  public async findOneById(id: E['id']) {
    const res = await this.repository.findOneBy({ id } as any)
    return res
  }
}
