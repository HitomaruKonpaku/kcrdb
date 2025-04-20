import { createKeyv } from '@keyv/redis'
import { CacheModule, CacheOptions } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as ms from 'ms'
import { StringValue } from 'ms'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { ENTITIES } from './constant/common.constant'
import { ReplayModule } from './module/replay/replay.module'
import { SimulatorModule } from './module/simulator/simulator.module'
import { UserAgentModule } from './module/user-agent/user-agent.module'
import { ErrorInterceptor } from './shared/interceptor/error.interceptor'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const opts: TypeOrmModuleOptions = {
          type: configService.get('DATABASE_TYPE'),
          url: configService.get('DATABASE_URL'),
          synchronize: true,
          entities: ENTITIES,
        }
        return opts
      },
      inject: [ConfigService],
    }),

    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const opts: CacheOptions = {
          stores: [
            createKeyv(configService.get('REDIS_URL')),
          ],
          ttl: ms(configService.get('CACHE_TTL') as StringValue),
        }
        return opts
      },
      inject: [ConfigService],
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            limit: 100,
            ttl: seconds(10),
          },
        ],
        errorMessage: 'Too Many Requests',
      }),
    }),

    ReplayModule,
    SimulatorModule,

    UserAgentModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule { }
