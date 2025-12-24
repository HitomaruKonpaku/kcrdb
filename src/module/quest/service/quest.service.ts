import { BadRequestException, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { In } from 'typeorm'
import { KcsapiState } from '../../../shared/kcsapi/kcsapi-state.enum'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { IdUtil } from '../../../shared/util/id.util'
import { ObjectUtil } from '../../../shared/util/object.util'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestExtra } from '../dto/quest-extra.dto'
import { QuestApiRoot } from '../interface/quest-api.interface'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'
import { QuestItemService } from './quest-item.service'
import { QuestSusService } from './quest-sus.service'

@Injectable()
export class QuestService extends KcsapiService<Quest, QuestRepository> {
  constructor(
    public readonly repository: QuestRepository,
    public readonly moduleRef: ModuleRef,
    private readonly questItemService: QuestItemService,
    private readonly questSusService: QuestSusService,
  ) {
    super(repository, moduleRef)
  }

  private getCheckFields(): string[] {
    return [
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_title',
      'api_detail',
    ]
  }

  protected getHashFields(): string[] {
    return [
      ...this.getCheckFields(),
      'api_voice_id',
      'api_lost_badges',
      'api_get_material',
      'api_select_rewards',
      'api_bonus_flag',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'state',
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
      'has_api_select_rewards',
    ]
  }

  protected getQueryLikeFilterFields(): string[] {
    return [
      'api_title',
      'api_detail',
    ]
  }

  protected getQuerySortFields(): string[] {
    return [
      'created_at',
      'updated_at',
      'state',
      'hit',
      'api_no',
      'api_category',
      'api_type',
      'api_label_type',
      'api_voice_id',
      'api_bonus_flag',
      'has_api_select_rewards',
    ]
  }

  public async createMany(body: QuestCreate) {
    if (!body.list.length) {
      return {
        total: 0,
      }
    }

    const tmpEntities = body.list.map((data, index) => this.createInputQuest(data, index))
    await this.repository.insertOrIgnore(tmpEntities)

    const hashes = tmpEntities.map((v) => v.hash).filter((v) => v)
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
    const checkFields = this.getCheckFields()
    const hashFields = this.getHashFields()

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

    const hash = ObjectUtil.hash(data, hashFields)
    const entity: Partial<Quest> = {
      id: IdUtil.generate(),
      hash,
      data,
      state: this.questSusService.isSus(data)
        ? KcsapiState.SUS
        : KcsapiState.NEW,
    }

    return entity
  }

  public async applyJoin(
    entities: Quest[],
    extra?: QuestExtra,
  ) {
    await super.applyJoin(entities, extra)

    if (extra?.extend?.includes('clearItems')) {
      await this.questItemService.attachClearItems(entities)
    }
  }
}
