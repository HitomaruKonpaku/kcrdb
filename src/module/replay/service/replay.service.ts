import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { Logger } from '../../../shared/logger'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { ReplayCreate } from '../dto/replay-create.dto'
import { Replay } from '../model/replay.entity'
import { ReplayRepository } from '../repository/replay.repository'

@Injectable()
export class ReplayService extends BaseService<Replay, ReplayRepository> {
  private readonly logger = new Logger(ReplayService.name)

  constructor(
    public readonly repository: ReplayRepository,
  ) {
    super(repository)
  }

  public async create(body: ReplayCreate) {
    const hash = CryptoUtil.hash(JSON.stringify(body.data))
    let res = await this.repository.findOneBy({ hash })
    if (res) {
      return res
    }

    const { world, mapnum: map, diff } = body.data
    res = await this.insertLoop({ ...body, hash, world, map, diff })
    return res
  }
}
