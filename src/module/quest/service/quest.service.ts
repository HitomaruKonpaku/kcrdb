import { BadRequestException, Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { PagingDto } from '../../../shared/dto/paging.dto'
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

  public async getAllRaw(
    paging?: PagingDto,
    filter?: QuestFilter,
  ) {
    const [items, total] = await this.repository.repository.findAndCount({
      select: { data: true },
      where: { ...(filter || {}) },
      order: { createdAt: 'DESC' },
      skip: paging?.offset,
      take: paging?.limit,
    })
    return {
      total,
      items: items.map((v) => v.data),
    }
  }

  public async create(body: QuestCreate) {
    const tmpQuests = body.list.map((data, index) => {
      if (!data.api_no) {
        throw new BadRequestException({
          message: 'api_no not found',
          error: 'Bad Request',
          statusCode: 400,
          index,
        })
      }

      if (!data.api_title) {
        throw new BadRequestException({
          message: 'api_title not found',
          error: 'Bad Request',
          statusCode: 400,
          index,
        })
      }

      if (!data.api_detail) {
        throw new BadRequestException({
          message: 'api_detail not found',
          error: 'Bad Request',
          statusCode: 400,
          index,
        })
      }

      const hash = CryptoUtil.hash(JSON.stringify({
        api_no: data.api_no,
        api_title: data.api_title,
        api_detail: data.api_detail,
      }))
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
}
