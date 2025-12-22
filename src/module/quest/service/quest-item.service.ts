import { Injectable } from '@nestjs/common'
import { In, SelectQueryBuilder } from 'typeorm'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { ObjectUtil } from '../../../shared/util/object.util'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { UserAgentService } from '../../user-agent/service/user-agent.service'
import { QuestItemCreate } from '../dto/quest-item-create.dto'
import { QuestItemExtra } from '../dto/quest-item-extra.dto'
import { QuestItemFilter } from '../dto/quest-item-filter.dto'
import { QuestItem } from '../model/quest-item.entity'
import { Quest } from '../model/quest.entity'
import { QuestItemRepository } from '../repository/quest-item.repository'

@Injectable()
export class QuestItemService extends BaseService<QuestItem, QuestItemRepository> {
  constructor(
    public readonly repository: QuestItemRepository,
    private readonly userAgentService: UserAgentService,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: QuestItemFilter,
    timeFilter?: TimeFilterDto,
    extra?: QuestItemExtra,
  ) {
    const qb = this.createQueryBuilder()
    qb.addSelect('qi.updatedAt')
    this.initQueryBuilder(paging, filter, timeFilter, qb)
    const [items, total] = await qb.getManyAndCount()
    await this.applyJoin(items, extra)
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

    const hash = ObjectUtil.hash(body, hashFields)
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

  public async attachClearItems(
    entities: Quest[],
    mapToProperty = 'clearItems',
  ) {
    if (!entities?.length || !mapToProperty) {
      return
    }

    const items = await this.repository.repository.find({
      select: [
        'api_quest_id',
        'api_select_no',
        'data',
        'hit',
      ],
      where: {
        api_quest_id: In(entities.map((v) => v.api_no || v.data.api_no).filter((v) => v)),
      },
      order: {
        hit: 'DESC',
        api_select_no: 'ASC',
      },
    })

    entities.forEach((entity) => {
      // eslint-disable-next-line no-param-reassign
      entity[mapToProperty] = items
        .filter((v) => v.api_quest_id === entity.api_no || v.api_quest_id === entity.data.api_no)
        .map((v) => {
          const obj: Partial<QuestItem> = { ...v }
          delete obj.api_quest_id
          return obj
        })
    })
  }

  private createQueryBuilder() {
    const qb = this.repository.repository.createQueryBuilder('qi')
    return qb
  }

  private initQueryBuilder(
    paging?: PagingDto,
    filter?: QuestItemFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<QuestItem>,
  ): SelectQueryBuilder<QuestItem> {
    const qb = baseQueryBuilder || this.createQueryBuilder()
    QueryBuilderUtil.applyQueryTimeFilter(qb, timeFilter)
    QueryBuilderUtil.applyQueryMatchFilter(
      qb,
      [
        'api_quest_id',
      ],
      filter,
    )
    QueryBuilderUtil.applyQuerySort(
      qb,
      [
        'created_at',
        'updated_at',
        'hit',
        'api_quest_id',
        'api_select_no',
      ],
      filter?.sort,
    )
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }

  private async applyJoin(
    entities: QuestItem[],
    extra?: QuestItemExtra,
  ) {
    if (!extra?.extend?.length) {
      return
    }

    if (extra.extend.includes('origins')) {
      await this.userAgentService.attachOrigins(entities, 'quest_item')
    }
  }
}
