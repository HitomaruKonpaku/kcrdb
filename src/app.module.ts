import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import configuration from './config/configuration'
import { Replay } from './module/replay/model/replay.entity'
import { ReplayModule } from './module/replay/replay.module'
import { Simulator } from './module/simulator/model/simulator.entity'
import { SimulatorModule } from './module/simulator/simulator.module'
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
          ],
        }
        return opts
      },
      inject: [ConfigService],
    }),

    ReplayModule,
    SimulatorModule,
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
    AppService,
  ],
})
export class AppModule { }
