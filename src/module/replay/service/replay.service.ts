import { BadRequestException, Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { Logger } from '../../../shared/logger'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { ReplayCreate } from '../dto/replay-create.dto'
import { Replay } from '../model/replay.entity'
import { ReplayRepository } from '../repository/replay.repository'

@Injectable()
export class ReplayService extends BaseService<Replay, ReplayRepository> {
  private readonly logger = new Logger('ReplayService')

  constructor(
    public readonly repository: ReplayRepository,
  ) {
    super(repository)
  }

  public async create(body: ReplayCreate) {
    const hash = CryptoUtil.hash(JSON.stringify(body.data))
    let res = await this.repository.repository.findOneBy({ hash })
    if (res) {
      return res
    }

    const { world, mapnum: map, diff } = body.data

    if (typeof world !== 'number') {
      this.logger.error(`WORLD_INVALID | ${JSON.stringify({ value: world })}`)
      throw new BadRequestException('WORLD_INVALID')
    }

    if (typeof map !== 'number') {
      this.logger.error(`MAPNUM_INVALID | ${JSON.stringify({ value: map })}`)
      throw new BadRequestException('MAPNUM_INVALID')
    }

    res = await this.insertOne({ ...body, hash, world, map, diff })
    return res
  }
}
