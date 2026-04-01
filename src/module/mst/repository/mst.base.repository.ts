import { Repository } from 'typeorm'
import { MstBaseEntity } from '../model/mst.base.entity'

export abstract class MstBaseRepository<E extends MstBaseEntity> {
  constructor(
    public readonly repository: Repository<E>,
  ) { }

  public get tableName() {
    return this.repository.metadata.tableName
  }
}
