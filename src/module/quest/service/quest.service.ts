/* eslint-disable quotes */

import { BadRequestException, Injectable } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { IdUtil } from '../../../shared/util/id.util'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestFilter } from '../dto/quest-filter.dto'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'

@Injectable()
export class QuestService extends BaseService<Quest, QuestRepository> {
  constructor(
    public readonly repository: QuestRepository,
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

    const tmpQuests = body.list.map((data, index) => {
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
      }
      return quest
    })

    const res = await this.repository.insertOrIgnore(tmpQuests)
    const okQuests = tmpQuests.filter((v) => v.createdAt)
    const ids = okQuests.map((v) => v.id)
    return {
      total: res.raw.length,
      ids,
    }
  }

  private createQueryBuilder(
    paging?: PagingDto,
    filter?: QuestFilter,
    timeFilter?: TimeFilterDto,
  ): SelectQueryBuilder<Quest> {
    const qb = this.repository.repository.createQueryBuilder('q')
    this.applyQueryNumberFilter(qb, filter)
    this.applyQueryTextFilter(qb, filter)
    this.applyQueryExistFilter(qb, filter)
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

  private applyQueryNumberFilter(
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

  private applyQueryTextFilter(
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

  private applyQueryExistFilter(
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
