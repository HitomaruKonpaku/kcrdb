import { createKeyv } from '@keyv/redis'
import { CacheModule, CacheOptions } from '@nestjs/cache-manager'
import { Module, OnApplicationBootstrap, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { seconds, ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as ms from 'ms'
import { StringValue } from 'ms'
import { OpenTelemetryModule, OpenTelemetryModuleOptions } from 'nestjs-otel'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { ENTITIES } from './constant/common.constant'
import { AdminModule } from './module/admin/admin.module'
import { QuestModule } from './module/quest/quest.module'
import { RemodelModule } from './module/remodel/remodel.module'
import { ReplayModule } from './module/replay/replay.module'
import { ShipModule } from './module/ship/ship.module'
import { SimulatorModule } from './module/simulator/simulator.module'
import { TokenSeenAtInterceptor } from './module/token/interceptor/token-seen-at.interceptor'
import { TokenModule } from './module/token/token.module'
import { UserAgentModule } from './module/user-agent/user-agent.module'
import { WebhookModule } from './module/webhook/webhook.module'
import { ErrorInterceptor } from './shared/interceptor/error.interceptor'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { Logger } from './shared/logger'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    ScheduleModule.forRoot(),

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
      useFactory: () => {
        const opts: ThrottlerModuleOptions = {
          throttlers: [
            {
              limit: 100,
              ttl: seconds(10),
            },
          ],
          errorMessage: 'Too Many Requests',
        }
        return opts
      },
    }),

    OpenTelemetryModule.forRootAsync({
      useFactory: () => {
        const opts: OpenTelemetryModuleOptions = {
          metrics: {
            // hostMetrics: true,
            apiMetrics: {
              enable: true,
              ignoreRoutes: [
                '/favicon.ico',
              ],
              ignoreUndefinedRoutes: false,
            },
          },
        }
        return opts
      },
    }),

    ReplayModule,
    SimulatorModule,
    QuestModule,
    RemodelModule,
    ShipModule,

    UserAgentModule,

    TokenModule,
    AdminModule,
    WebhookModule,
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
      provide: APP_INTERCEPTOR,
      useClass: TokenSeenAtInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown, OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name)

  onModuleInit() {
    // this.logger.debug('onModuleInit')
  }

  onApplicationBootstrap() {
    // this.logger.debug('onApplicationBootstrap')
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`onApplicationShutdown | ${JSON.stringify({ signal })}`)
  }
}
