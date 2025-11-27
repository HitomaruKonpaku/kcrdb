import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Token } from '../model/token.entity'

@Injectable()
export class TokenRepository extends BaseRepository<Token> {
  constructor(
    @InjectRepository(Token)
    public readonly repository: Repository<Token>,
  ) {
    super(repository)
  }
}
