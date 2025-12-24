import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, In, Repository } from 'typeorm'
import { BaseEntity } from '../../../shared/base/base.entity'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Logger } from '../../../shared/logger'
import { IdUtil } from '../../../shared/util/id.util'
import { USER_AGENT_UNIQUE_KEYS } from '../constant/user-agent.constant'
import { UserAgent } from '../model/user-agent.entity'

@Injectable()
export class UserAgentRepository extends BaseRepository<UserAgent> implements OnModuleInit {
  private readonly logger = new Logger(UserAgentRepository.name)

  constructor(
    @InjectRepository(UserAgent)
    public readonly repository: Repository<UserAgent>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(repository)
  }

  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.query(`
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS uq_default ON user_agent (
  source_name,
  source_id,
  hashtext(raw),
  hashtext(raw || 'x_kcrdb'),
  hashtext(COALESCE(origin, '')),
  COALESCE(x_origin, ''),
  COALESCE(x_version, '')
)
      `)
    } catch (error) {
      this.logger.error(`onModuleInit: ${error.message} | ${JSON.stringify({ error })}`)
    }
  }

  public async upsert(data: Partial<UserAgent>) {
    const res = await this.repository.upsert(
      {
        ...data,
        id: data.id || IdUtil.generate(),
      },
      {
        conflictPaths: USER_AGENT_UNIQUE_KEYS,
        skipUpdateIfNoValuesChanged: true,
      },
    )
    return res
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
}
