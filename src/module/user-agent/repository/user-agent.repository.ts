import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Logger } from '../../../shared/logger'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { UAFilter } from '../dto/ua-filter.dto'
import { UserAgent } from '../model/user-agent.entity'

@Injectable()
export class UserAgentRepository extends BaseRepository<UserAgent> {
  private readonly logger = new Logger(UserAgentRepository.name)

  constructor(
    @InjectRepository(UserAgent)
    public readonly repository: Repository<UserAgent>,
  ) {
    super(repository)
  }

  public async findBySource(
    sourceName: string,
    sourceIds: string[],
    filter?: UAFilter,
  ): Promise<Omit<Omit<UserAgent, keyof BaseEntity>, 'sourceName'>[]> {
    if (!sourceName || !sourceIds.length) {
      return []
    }

    const queryFields = [
      'raw',
      'origin',
      'x_origin',
      'x_version',
    ]

    const query = this.repository
      .createQueryBuilder('ua')
      .select('source_id', 'sourceId')
      .addSelect('raw')
      .addSelect('origin')
      .addSelect('x_origin', 'xOrigin')
      .addSelect('x_version', 'xVersion')
      .addSelect('hit')
      .andWhere('is_active = TRUE')
      .andWhere('source_name = :sourceName', { sourceName })
      .andWhere('source_id IN (:...sourceIds)', { sourceIds })
      .addOrderBy('hit', 'DESC')
      .addOrderBy('raw', 'ASC')
      .addOrderBy('origin', 'ASC', 'NULLS LAST')
      .addOrderBy('x_origin', 'ASC', 'NULLS LAST')
      .addOrderBy('x_version', 'ASC', 'NULLS LAST')

    QueryBuilderUtil.applyQueryLikeFilter(query, queryFields, filter)

    if (filter?.query) {
      query.andWhere(new Brackets((qb) => {
        queryFields.forEach((key) => {
          qb.orWhere(`${query.alias}.${key} ILIKE :query`, { query: `%${filter.query}%` })
        })
      }))
    }

    const res = await query.getRawMany()
    return res
  }

  public async insertAndHit(entities: Partial<UserAgent>[]) {
    await this.repository.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(UserAgent)
        .values(entities)
        .orIgnore()
        .execute()

      await manager.update(
        UserAgent,
        { hash: In(entities.map((v) => v.hash)) },
        { hit: () => 'COALESCE(hit, 0) + 1' },
      )
    })
  }
}
