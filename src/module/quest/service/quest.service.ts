/* eslint-disable quotes */

import { BadRequestException, Injectable } from '@nestjs/common'
import { In, SelectQueryBuilder } from 'typeorm'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { IdUtil } from '../../../shared/util/id.util'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestFilter } from '../dto/quest-filter.dto'
import { QuestApiRoot } from '../interface/quest-api.interface'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'
import { QuestSusService } from './quest-sus.service'

@Injectable()
export class QuestService extends BaseService<Quest, QuestRepository> {
  constructor(
    public readonly repository: QuestRepository,
    private readonly questSusService: QuestSusService,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
  ) {
    const qb = this.createQueryBuilder(paging, filter, timeFilter)
    const [items, total] = await qb.getManyAndCount()
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
    const qb = this.createQueryBuilder(paging, filter, timeFilter)
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
      ...data,
      id: IdUtil.generate(),
      hash,
      data,
      datab: data,
      isSus: this.questSusService.isSus(data),
    }

    return quest
  }

  private createQueryBuilder(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
  ): SelectQueryBuilder<Quest> {
    const qb = this.repository.repository.createQueryBuilder('q')
    this.applyQueryApiNumberFilter(qb, filter)
    this.applyQueryApiTextFilter(qb, filter)
    this.applyQueryApiExistFilter(qb, filter)
    this.applyQueryDefaultFilter(qb, filter)
    this.applyQueryTimeFilter(qb, timeFilter)
    this.applyQuerySort(qb, filter)
    this.applyQueryPaging(qb, paging)
    return qb
  }

  private applyQueryPaging(
    qb: SelectQueryBuilder<Quest>,
    paging?: PagingDto,
  ) {
    if (paging?.offset !== undefined) {
      qb.skip(paging.offset)
    }
    if (paging?.limit !== undefined) {
      qb.take(paging.limit)
    }
  }

  private applyQueryApiNumberFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const fields = [
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
    ]
    fields.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`(q.datab ->> '${key}')::int = :${key}`, { [key]: filter[key] })
      }
    })
  }

  private applyQueryApiTextFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    const textFields = [
      'api_title',
      'api_detail',
    ]
    textFields.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`(q.datab ->> '${key}') ILIKE :${key}`, { [key]: `%${filter[key]}%` })
      }
    })
  }

  private applyQueryApiExistFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    if (filter?.has_api_select_rewards !== undefined) {
      if (filter.has_api_select_rewards) {
        qb.andWhere(`q.datab ? 'api_select_rewards'`)
      } else {
        qb.andWhere(`NOT q.datab ? 'api_select_rewards'`)
      }
    }
  }

  private applyQueryDefaultFilter(
    qb: SelectQueryBuilder<Quest>,
    filter?: QuestFilter,
  ) {
    if (filter?.is_sus !== undefined) {
      qb.andWhere('q.is_sus = :is_sus', { is_sus: filter.is_sus })
    }
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

    const apiKeys = [
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
    ]

    const allowKeys = [
      'created_at',
      'hit',
      ...apiKeys,
    ]

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

      if (!allowKeys.includes(sortKey)) {
        return
      }

      sortKeys.add(sortKey)

      if (apiKeys.includes(sortKey)) {
        qb.addOrderBy(`(q.datab ->> '${sortKey}')::int`, sortDirection)
      } else {
        qb.addOrderBy(`q.${sortKey}`, sortDirection)
      }
    })

    if (!sortKeys.has('created_at')) {
      qb.addOrderBy('q.created_at', 'DESC')
    }
  }
}
