import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { In } from 'typeorm'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { IdUtil } from '../../../shared/util/id.util'
import { ObjectUtil } from '../../../shared/util/object.util'
import { QuestApiRoot } from '../../quest/interface/quest-api.interface'
import { Quest } from '../../quest/model/quest.entity'
import { ShipStatsCreate } from '../dto/ship-stats-create.dto'
import { ShipStats } from '../model/ship-stats.entity'
import { ShipStatsRepository } from '../repository/ship-stats.repository'

@Injectable()
export class ShipStatsService extends KcsapiService<ShipStats, ShipStatsRepository> {
  constructor(
    public readonly repository: ShipStatsRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected getHashFields(): string[] {
    return [
      'data',
      'type',
      'api_ship_id',
      'api_lv',
      'slot_empty',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'type',
      'api_ship_id',
      'slot_empty',
    ]
  }

  protected getQuerySortFields(): string[] {
    return [
      'created_at',
      'updated_at',
      'state',
      'hit',
      'api_ship_id',
    ]
  }

  public async createMany(body: ShipStatsCreate) {
    if (!body.list.length) {
      return {
        total: 0,
      }
    }

    const tmpEntities = body.list.map((data) => {
      const hashFields = this.getHashFields()
      const hash = ObjectUtil.hash(data, hashFields)
      const entity: Partial<ShipStats> = {
        ...data,
        id: IdUtil.generate(),
        hash,
        type: body.type,
      }
      return entity
    })
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

  private createInputQuest(data: QuestApiRoot): Partial<Quest> {
    const hashFields = this.getHashFields()

    const hash = ObjectUtil.hash(data, hashFields)
    const quest: Partial<Quest> = {
      id: IdUtil.generate(),
      hash,
      data,
    }

    return quest
  }
}
