import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { Replay } from './module/replay/model/replay.entity'
import { ReplayModule } from './module/replay/replay.module'
import { Simulator } from './module/simulator/model/simulator.entity'
import { SimulatorModule } from './module/simulator/simulator.module'
import { UserAgent } from './module/user-agent/model/user-agent.entity'
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
          type: 'postgres',
          url: configService.get('DATABASE_URL'),
          synchronize: true,
          entities: [
            Replay,
            Simulator,

            UserAgent,
          ],
        }
        return opts
      },
      inject: [ConfigService],
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
