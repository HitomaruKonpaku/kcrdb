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
      'api_get_material',
      'api_select_rewards',
    ]

    const tmpQuests = body.list.map((data, index) => {
      checkFields.forEach((field) => {
        if (!data[field]) {
          throw new BadRequestException({
            message: `${field} not found`,
            error: 'Bad Request',
            statusCode: 400,
            index,
            data,
          })
        }
      })

      const hashObj = hashFields.reduce((obj, key) => {
        if (data[key]) {
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
}
