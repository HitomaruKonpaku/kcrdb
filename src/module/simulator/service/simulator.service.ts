import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/base/base.service'
import { CryptoUtil } from '../../../shared/util/crypto.util'
import { SimulatorCreate } from '../dto/simulator-create.dto'
import { Simulator } from '../model/simulator.entity'
import { SimulatorRepository } from '../repository/simulator.repository'

@Injectable()
export class SimulatorService extends BaseService<Simulator, SimulatorRepository> {
  constructor(
    public readonly repository: SimulatorRepository,
  ) {
    super(repository)
  }

  public async create(body: SimulatorCreate) {
    const res = await this.save({
      ...body,
      hash: CryptoUtil.hash(body.data),
    })
    return res
  }
}
