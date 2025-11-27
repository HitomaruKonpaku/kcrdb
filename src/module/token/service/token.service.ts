import { Injectable } from '@nestjs/common'
import { API_KEY_LENGTH } from '../../../constant/common.constant'
import { BaseService } from '../../../shared/base/base.service'
import { IdUtil } from '../../../shared/util/id.util'
import { Token } from '../model/token.entity'
import { TokenRepository } from '../repository/token.repository'

@Injectable()
export class TokenService extends BaseService<Token, TokenRepository> {
  constructor(
    public readonly repository: TokenRepository,
  ) {
    super(repository)
  }

  public async create() {
    const res = await this.repository.save({
      id: IdUtil.generate(API_KEY_LENGTH),
    })
    return res
  }
}
