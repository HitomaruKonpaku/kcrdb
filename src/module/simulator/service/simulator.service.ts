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
    const hash = CryptoUtil.hash(body.data)
    let res = await this.repository.repository.findOneBy({ hash })
    if (res) {
      return res
    }

    res = await this.insertOne({ ...body, hash })
    return res
  }
}
