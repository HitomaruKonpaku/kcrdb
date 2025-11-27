import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenController } from './controller/token.controller'
import { Token } from './model/token.entity'
import { TokenRepository } from './repository/token.repository'
import { TokenService } from './service/token.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Token,
    ]),
  ],
  controllers: [
    TokenController,
  ],
  providers: [
    TokenRepository,
    TokenService,
  ],
  exports: [
    TokenRepository,
    TokenService,
  ],
})
export class TokenModule { }
