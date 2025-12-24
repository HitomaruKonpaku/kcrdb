import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { In } from 'typeorm'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QuestItem } from '../model/quest-item.entity'
import { Quest } from '../model/quest.entity'
import { QuestItemRepository } from '../repository/quest-item.repository'

@Injectable()
export class QuestItemService extends KcsapiService<QuestItem, QuestItemRepository> {
  constructor(
    public readonly repository: QuestItemRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected getHashFields(): string[] {
    return [
      'data',
      'api_quest_id',
      'api_select_no',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'state',
      'api_quest_id',
    ]
  }

  protected getQuerySortFields(): string[] {
    return [
      'created_at',
      'updated_at',
      'state',
      'hit',
      'api_quest_id',
      'api_select_no',
    ]
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
}
