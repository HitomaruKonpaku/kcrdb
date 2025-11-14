import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Logger } from '../../../shared/logger'
import { QuestItem } from '../model/quest-item.entity'

@Injectable()
export class QuestItemRepository extends BaseRepository<QuestItem> implements OnModuleInit {
  private readonly logger = new Logger(QuestItemRepository.name)

  constructor(
    @InjectRepository(QuestItem)
    public readonly repository: Repository<QuestItem>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(repository)
  }

  onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner()
    queryRunner.startTransaction()
    queryRunner
      .query('CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quest_item_datab_gin ON quest USING GIN (datab)')
      .then(() => {
        queryRunner.commitTransaction()
      })
      .catch((error) => {
        queryRunner.rollbackTransaction()
        this.logger.error(`idx_quest_item_datab_gin: ${error.message}`)
      })
  }
}
