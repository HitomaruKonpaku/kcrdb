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
        id: IdUtil.generate(),
        hash,
        ...data,
        data,
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

    if (filter?.api_no !== undefined) {
      qb.andWhere('q.api_no = :api_no', { api_no: filter.api_no })
    }
    if (filter?.api_category !== undefined) {
      qb.andWhere('q.api_category = :api_category', { api_category: filter.api_category })
    }
    if (filter?.api_type !== undefined) {
      qb.andWhere('q.api_type = :api_type', { api_type: filter.api_type })
    }
    if (filter?.api_label_type !== undefined) {
      qb.andWhere('q.api_label_type = :api_label_type', { api_label_type: filter.api_label_type })
    }

    if (filter?.has_api_select_rewards !== undefined) {
      if (filter.has_api_select_rewards) {
        qb.andWhere(`q.data::JSONB ? 'api_select_rewards'`)
      } else {
        qb.andWhere(`NOT q.data::JSONB ? 'api_select_rewards'`)
      }
    }

    if (timeFilter?.before !== undefined) {
      qb.andWhere('q.created_at <= :before', { before: timeFilter.before })
    }
    if (timeFilter?.after !== undefined) {
      qb.andWhere('q.created_at >= :after', { after: timeFilter.after })
    }

    qb.addOrderBy('q.created_at', 'DESC')

    if (paging?.offset !== undefined) {
      qb.skip(paging.offset)
    }
    if (paging?.limit !== undefined) {
      qb.take(paging.limit)
    }

    return qb
  }
}
