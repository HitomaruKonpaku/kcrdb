import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Logger } from '../../../shared/logger'
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
  ): Promise<Omit<Omit<UserAgent, keyof BaseEntity>, 'sourceName'>[]> {
    if (!sourceName || !sourceIds.length) {
      return []
    }

    const res = await this.repository.find({
      select: [
        'sourceId',
        'raw',
        'origin',
        'xOrigin',
        'xVersion',
        'hit',
      ],
      where: {
        sourceName,
        sourceId: In(sourceIds),
      },
      order: {
        hit: 'DESC',
        raw: 'ASC',
        origin: { direction: 'ASC', nulls: 'LAST' },
        xOrigin: { direction: 'ASC', nulls: 'LAST' },
        xVersion: { direction: 'ASC', nulls: 'LAST' },
      },
    })
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
