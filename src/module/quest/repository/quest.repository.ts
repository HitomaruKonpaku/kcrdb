import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Logger } from '../../../shared/logger'
import { Quest } from '../model/quest.entity'

@Injectable()
export class QuestRepository extends BaseRepository<Quest> implements OnModuleInit {
  private readonly logger = new Logger(QuestRepository.name)

  constructor(
    @InjectRepository(Quest)
    public readonly repository: Repository<Quest>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(repository)
  }

  onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner()
    queryRunner.startTransaction()
    queryRunner
      .query('CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quest_datab_gin ON quest USING GIN (datab)')
      .then(() => {
        queryRunner.commitTransaction()
      })
      .catch((error) => {
        queryRunner.rollbackTransaction()
        this.logger.error(`idx_quest_datab_gin: ${error.message}`)
      })
  }
}
