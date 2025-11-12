import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BaseEntity } from './base.entity'

export abstract class BaseRepository<E extends BaseEntity> {
  constructor(
    public readonly repository: Repository<E>,
  ) { }

  public async findOneBy(where: FindOptionsWhere<E> | FindOptionsWhere<E>[]) {
    const res = await this.repository.findOneBy(where)
    return res
  }

  public async findOneById(id: E['id']) {
    const res = await this.repository.findOneBy({ id } as any)
    return res
  }

  public async save(data: DeepPartial<E>) {
    const res = await this.repository.save(data)
    return res
  }

  public async insert(data: QueryDeepPartialEntity<E>) {
    const res = await this.repository.insert(data)
    return res
  }

  public async insertOrIgnore(data: QueryDeepPartialEntity<E> | QueryDeepPartialEntity<E>[]) {
    const res = await this.repository
      .createQueryBuilder()
      .insert()
      .values(data)
      .orIgnore()
      .execute()
    return res
  }
}
