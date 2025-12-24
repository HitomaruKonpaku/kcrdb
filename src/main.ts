import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { json } from 'body-parser'
import * as compression from 'compression'
import 'dotenv/config'
import { join } from 'path'
import { AppModule } from './app.module'
import { SwaggerLoggerMiddleware } from './middleware/swagger-logger.middleware'
import { Logger } from './shared/logger'
import { setupSwagger } from './swagger'
import otelSDK from './tracing'

async function bootstrap() {
  otelSDK?.start()

  const logger = new Logger('Main')

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger(),
  })

  app.enableCors()
  app.enableShutdownHooks()

  app.set('trust proxy', true)

  app.use(compression())
  app.use(json({ limit: process.env.BODY_JSON_LIMIT || '500kb' }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  app.setBaseViewsDir(join(__dirname, '..', 'view'))
  app.setViewEngine('hbs')

  app.use((req, res, next) => {
    const middleware = new SwaggerLoggerMiddleware()
    middleware.use(req, res, next)
  })

  setupSwagger(app)

  const host = process.env.HOST || 'localhost'
  const port = Number(process.env.PORT) || 8080

  await app.listen(port, () => {
    const url = `http://${host}:${port}`
    logger.log(`🚀 Server  | ${url}`)
    logger.log(`📄 Docs    | ${url}/docs`)
    if (otelSDK) {
      logger.log(`📊 Metrics | ${otelSDK.url}`)
    }
  })
}

bootstrap()
