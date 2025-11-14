import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { CryptoUtil } from '../../../shared/util/crypto.util'
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
    const [items, total] = await this.repository.repository.findAndCount({
      where: { ...(filter || {}) },
      order: { createdAt: 'DESC' },
      skip: paging?.offset,
      take: paging?.limit,
    })
    return {
      total,
      items,
    }
  }

  public async create(body: QuestItemCreate) {
    const hashObj: Partial<QuestItem> = {
      api_quest_id: body.api_quest_id,
      data: body.data,
    }

    const hash = CryptoUtil.hash(JSON.stringify(hashObj))
    let res = await this.repository.findOneBy({ hash })
    if (res) {
      return res
    }

    const tmp: Partial<QuestItem> = {
      ...body,
      hash,
      // datab: body.data,
    }
    res = await this.insertLoop(tmp)
    return res
  }
}
