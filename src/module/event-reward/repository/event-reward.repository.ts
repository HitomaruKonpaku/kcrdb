import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { EventReward } from '../model/event-reward.entity'

@Injectable()
export class EventRewardRepository extends BaseRepository<EventReward> {
  constructor(
    @InjectRepository(EventReward)
    public readonly repository: Repository<EventReward>,
  ) {
    super(repository)
  }

  public async getStats() {
    const qb = this.repository
      .createQueryBuilder()
      .select('world')
      .addSelect('map')
      .addSelect('difficulty')
      .addSelect('SUM(hit)', 'hit')
      .addGroupBy('world')
      .addGroupBy('map')
      .addGroupBy('difficulty')
      .addOrderBy('world', 'DESC')
      .addOrderBy('map')
      .addOrderBy('difficulty')

    const res = await qb.getRawMany()
    res.forEach((v) => {
      // eslint-disable-next-line no-param-reassign
      v.hit = Number(v.hit)
    })

    return res
  }

  public async getStatsFull() {
    const qb = this.repository
      .createQueryBuilder('er')
      .select('er.id')
      .addSelect('er.createdAt')
      .addSelect('er.updatedAt')
      .addSelect('er.hash')
      .addSelect('er.hit')
      .addSelect('er.world')
      .addSelect('er.map')
      .addSelect('er.difficulty')
      .addOrderBy('er.world', 'DESC')
      .addOrderBy('er.map')
      .addOrderBy('er.difficulty')
      .addOrderBy('er.createdAt')

    const [items, total] = await qb.getManyAndCount()
    return { total, items }
  }
}
