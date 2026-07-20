import { BadRequestException, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { In } from 'typeorm'
import { KcsapiState } from '../../../shared/kcsapi/kcsapi-state.enum'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { CacheUtil } from '../../../shared/util/cache.util'
import { IdUtil } from '../../../shared/util/id.util'
import { ObjectUtil } from '../../../shared/util/object.util'
import { QuestCreate } from '../dto/quest-create.dto'
import { QuestExtra } from '../dto/quest-extra.dto'
import { QuestApiRoot } from '../interface/quest-api.interface'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'
import { QuestItemService } from './quest-item.service'
import { QuestSusService } from './quest-sus.service'

type QuestSimple = Pick<Quest, 'id' | 'hash'>

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
      return { total: 0 }
    }

    const tmpEntities = body.list.map((data, index) => this.createInputQuest(data, index))

    // Batch cache check — same key pattern as createOneWithHashFields
    const cacheKeys = tmpEntities.map((v) => CacheUtil.key(this.repository.tableName, v.hash!))
    const cacheResults = await Promise.allSettled(cacheKeys.map((key) => this.cache.get<QuestSimple>(key)))

    const cachedResults: QuestSimple[] = []
    const missEntities: Partial<Quest>[] = []

    cacheResults.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value) {
        cachedResults.push({ id: result.value.id, hash: result.value.hash })
      } else {
        if (result.status === 'rejected') {
          this.logger.warn(`createMany#cache#get: ${result.reason?.message ?? result.reason} | ${JSON.stringify({ key: cacheKeys[i] })}`)
        }
        missEntities.push(tmpEntities[i])
      }
    })

    // DB only for cache misses
    let dbResults: QuestSimple[] = []
    if (missEntities.length > 0) {
      await this.repository.insertOrIgnore(missEntities)

      const missHashes = missEntities.map((v) => v.hash)
      const [items] = await this.repository.repository.findAndCount({
        select: { id: true, hash: true },
        where: { hash: In(missHashes) },
      })

      // Warm cache — store only id and hash (all createMany needs)
      items.forEach((item) => {
        const key = CacheUtil.key(this.repository.tableName, item.hash)
        this.cache.set(key, { id: item.id, hash: item.hash }, this.ttl).catch((error) => {
          this.logger.warn(`createMany#cache#set: ${error?.message ?? error} | ${JSON.stringify({ key })}`)
        })
      })

      dbResults = items.map((v) => ({ id: v.id, hash: v.hash }))
    }

    const allResults = [...cachedResults, ...dbResults]

    return {
      total: allResults.length,
      ids: allResults.map((v) => v.id),
      hashes: allResults.map((v) => v.hash),
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
