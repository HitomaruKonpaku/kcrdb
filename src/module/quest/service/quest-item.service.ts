import { Injectable } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { QuestItemCreate } from '../dto/quest-item-create.dto'
import { QuestItemFilter } from '../dto/quest-item-filter.dto'
import { QuestItem } from '../model/quest-item.entity'
import { QuestItemRepository } from '../repository/quest-item.repository'

@Injectable()
export class QuestItemService extends BaseService<QuestItem, QuestItemRepository> {
  constructor(
    public readonly repository: QuestItemRepository,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: QuestItemFilter,
  ) {
    const qb = this.createQueryBuilder(paging, filter)
    qb.addSelect('qi.updatedAt')
    const [items, total] = await qb.getManyAndCount()
    return {
      total,
      items,
    }
  }

  public async create(body: QuestItemCreate) {
    const hashFields = [
      'api_quest_id',
      'api_select_no',
      'data',
    ]

    const hashObj = hashFields.reduce((obj, key) => {
      if (key in body) {
        Object.assign(obj, { [key]: body[key] })
      }
      return obj
    }, {})

    const hash = CryptoUtil.hash(JSON.stringify(hashObj))
    let res = await this.repository.findOneBy({ hash })
    if (res) {
      res.hash = hash
      return res
    }

    const tmp: Partial<QuestItem> = {
      ...body,
      hash,
    }
    res = await this.insertLoop(tmp)
    res.hash = hash
    return res
  }

  private createQueryBuilder(
    paging?: PagingDto,
    filter?: QuestItemFilter,
  ): SelectQueryBuilder<QuestItem> {
    const qb = this.repository.repository.createQueryBuilder('qi')
    this.applyQueryDefaultFilter(qb, filter)
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }

  private applyQueryDefaultFilter(
    qb: SelectQueryBuilder<QuestItem>,
    filter?: QuestItemFilter,
  ) {
    const keys = [
      'api_quest_id',
    ]
    keys.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`qi.${key} = :${key}`, { [key]: filter[key] })
      }
    })
  }
}
