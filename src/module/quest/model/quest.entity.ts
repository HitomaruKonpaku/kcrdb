/* eslint-disable quotes */

import { Column, Entity, Index } from 'typeorm'
import { KcsapiEntity } from '../../../shared/kcsapi/kcsapi.entity'
import { QuestApi } from '../dto/quest-api.dto'

@Entity({ name: 'quest' })
export class Quest extends KcsapiEntity<QuestApi> {
  @Column({
    name: 'api_no',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_no')::int`,
    select: false,
  })
  @Index()
  api_no?: number

  @Column({
    name: 'api_category',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_category')::int`,
    select: false,
  })
  api_category?: number

  @Column({
    name: 'api_type',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_type')::int`,
    select: false,
  })
  api_type?: number

  @Column({
    name: 'api_label_type',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_label_type')::int`,
    select: false,
  })
  api_label_type?: number

  @Column({
    name: 'api_title',
    type: 'varchar',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_title')`,
    select: false,
  })
  api_title?: string

  @Column({
    name: 'api_detail',
    type: 'varchar',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_detail')`,
    select: false,
  })
  api_detail?: string

  @Column({
    name: 'api_voice_id',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_voice_id')::int`,
    select: false,
  })
  api_voice_id?: number

  @Column({
    name: 'api_bonus_flag',
    type: 'int',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ->> 'api_bonus_flag')::int`,
    select: false,
  })
  api_bonus_flag?: number

  @Column({
    name: 'has_api_select_rewards',
    type: 'boolean',
    generatedType: 'STORED',
    asExpression: `(data::jsonb ? 'api_select_rewards')`,
    select: false,
  })
  has_api_select_rewards?: boolean
}
