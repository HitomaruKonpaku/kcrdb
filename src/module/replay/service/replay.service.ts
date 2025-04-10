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
    const { world, mapnum: map, diff } = body.data

    if (typeof world !== 'number') {
      this.logger.error(`WORLD_INVALID | ${JSON.stringify({ value: world })}`)
      throw new BadRequestException('WORLD_INVALID')
    }

    if (typeof map !== 'number') {
      this.logger.error(`MAPNUM_INVALID | ${JSON.stringify({ value: map })}`)
      throw new BadRequestException('MAPNUM_INVALID')
    }

    const res = await this.save({
      ...body,
      hash: CryptoUtil.hash(JSON.stringify(body.data)),
      world,
      map,
      diff,
    })
    return res
  }
}
