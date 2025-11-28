/* eslint-disable quotes */

import { BadRequestException, Injectable } from '@nestjs/common'
import { In, SelectQueryBuilder } from 'typeorm'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { IdUtil } from '../../../shared/util/id.util'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { UserAgentService } from '../../user-agent/service/user-agent.service'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestExtra } from '../dto/quest-extra.dto'
import { QuestFilter } from '../dto/quest-filter.dto'
import { QuestApiRoot } from '../interface/quest-api.interface'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'
import { QuestItemService } from './quest-item.service'
import { QuestSusService } from './quest-sus.service'

@Injectable()
export class QuestService extends BaseService<Quest, QuestRepository> {
  constructor(
    public readonly repository: QuestRepository,
    private readonly userAgentService: UserAgentService,
    private readonly questItemService: QuestItemService,
    private readonly questSusService: QuestSusService,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
    extra?: QuestExtra,
  ) {
    const qb = this.createQueryBuilder()
    qb.addSelect('q.updatedAt')
    this.initQueryBuilder(paging, filter, timeFilter, qb)
    const [items, total] = await qb.getManyAndCount()
    await this.applyJoin(items, extra)
    return {
      total,
      items,
    }
  }

  public async getAllRaw(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
  ) {
    const qb = this.initQueryBuilder(paging, filter, timeFilter)
    qb.select('q.data')
    const [items, total] = await qb.getManyAndCount()
    return {
      total,
      items: items.map((v) => v.data),
    }
  }

  public async create(body: QuestCreate) {
    if (!body.list.length) {
      return {
        total: 0,
      }
    }

    const tmpQuests = body.list.map((data, index) => this.createInputQuest(data, index))
    await this.repository.insertOrIgnore(tmpQuests)

    const hashes = tmpQuests.map((v) => v.hash).filter((v) => v)
    const [items, total] = await this.repository.repository.findAndCount({
      select: { id: true, hash: true },
      where: { hash: In(hashes) },
    })

    return {
      total,
      ids: items.map((v) => v.id),
      hashes: items.map((v) => v.hash),
    }
  }

  private createInputQuest(data: QuestApiRoot, index: number): Partial<Quest> {
    const checkFields = [
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_title',
      'api_detail',
    ]

    const hashFields = [
      ...checkFields,
      'api_voice_id',
      'api_lost_badges',
      'api_get_material',
      'api_select_rewards',
      'api_bonus_flag',
    ]

    checkFields.forEach((key) => {
      if (!(key in data)) {
        throw new BadRequestException({
          message: `${key} not found`,
          error: 'Bad Request',
          statusCode: 400,
          data: {
            key,
            index,
            data,
          },
        })
      }
    })

    const hashObj = hashFields.reduce((obj, key) => {
      if (key in data) {
        Object.assign(obj, { [key]: data[key] })
      }
      return obj
    }, {})

    const hash = CryptoUtil.hash(JSON.stringify(hashObj))
    const quest: Partial<Quest> = {
      id: IdUtil.generate(),
      hash,
      data,
      isSus: this.questSusService.isSus(data),
    }

    return quest
  }

  private createQueryBuilder() {
    const qb = this.repository.repository.createQueryBuilder('q')
    return qb
  }

  private initQueryBuilder(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<Quest>,
  ): SelectQueryBuilder<Quest> {
    const qb = baseQueryBuilder || this.createQueryBuilder()
    this.applyQueryApiNumberFilter(qb, filter)
    this.applyQueryApiTextFilter(qb, filter)
    this.applyQueryApiExistFilter(qb, filter)
    this.applyQueryDefaultFilter(qb, filter)
    this.applyQueryTimeFilter(qb, timeFilter)
    this.applyQuerySort(qb, filter)
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }

  private applyQueryApiNumberFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const keys = [
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
    ]
    keys.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`q.${key} = :${key}`, { [key]: filter[key] })
      }
    })
  }

  private applyQueryApiTextFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const keys = [
      'api_title',
      'api_detail',
    ]
    keys.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`q.${key} ILIKE :${key}`, { [key]: `%${filter[key]}%` })
      }
    })
  }

  private applyQueryApiExistFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const keys = [
      'has_api_select_rewards',
    ]
    keys.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`q.${key} = :${key}`, { [key]: filter[key] })
      }
    })
  }

  private applyQueryDefaultFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const keys = [
      'is_verified',
      'is_sus',
      'is_mod',
    ]
    keys.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`q.${key} = :${key}`, { [key]: filter[key] })
      }
    })
  }

  private applyQueryTimeFilter(
    qb: SelectQueryBuilder<Quest>,
    timeFilter?: TimeFilterDto,
  ) {
    if (timeFilter?.before !== undefined) {
      qb.andWhere('q.created_at <= :before', { before: timeFilter.before })
    }
    if (timeFilter?.after !== undefined) {
      qb.andWhere('q.created_at >= :after', { after: timeFilter.after })
    }
  }

  private applyQuerySort(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    if (filter?.sort === undefined) {
      qb.addOrderBy('q.created_at', 'DESC')
      return
    }

    const allowKeys = new Set([
      'created_at',
      'updated_at',
      'hit',
      'is_verified',
      'is_sus',
      'is_mod',
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
    ])

    const sortKeys = new Set()
    const curKeys = filter.sort.split(',')

    curKeys.forEach((key) => {
      let sortKey: string
      let sortDirection: 'ASC' | 'DESC'
      if (key.startsWith('-')) {
        sortKey = key.substring(1)
        sortDirection = 'DESC'
      } else {
        sortKey = key
        sortDirection = 'ASC'
      }

      if (!allowKeys.has(sortKey)) {
        return
      }

      sortKeys.add(sortKey)
      qb.addOrderBy(`q.${sortKey}`, sortDirection)
    })

    if (!sortKeys.has('created_at')) {
      qb.addOrderBy('q.created_at', 'DESC')
    }
  }

  private async applyJoin(
    entities: Quest[],
    extra?: QuestExtra,
  ) {
    if (extra?.extend === undefined) {
      return
    }

    const keys = Array.isArray(extra.extend)
      ? extra.extend
      : extra.extend.split(',')
    if (!keys.length) {
      return
    }

    if (keys.includes('origins')) {
      await this.userAgentService.attachOrigins(entities, 'quest')
    }

    if (keys.includes('clearItems')) {
      await this.questItemService.attachClearItems(entities)
    }
  }
}
