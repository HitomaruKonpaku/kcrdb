import { Column, Index } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { BigIntTransformer } from '../transformer/bigint.transformer'
import { KcsapiState } from './kcsapi-state.enum'

export abstract class KcsapiEntity<T> extends BaseEntity {
  @Column({
    name: 'hash',
    type: 'varchar',
    unique: true,
    select: false,
  })
  hash: string

  @Index()
  @Column({
    name: 'state',
    type: 'smallint',
    default: 0,
  })
  state?: KcsapiState

  @Column({
    name: 'hit',
    type: 'bigint',
    default: 0,
    transformer: BigIntTransformer,
  })
  hit?: number

  @Column({
    name: 'data',
    type: 'json',
  })
  data: T
}
