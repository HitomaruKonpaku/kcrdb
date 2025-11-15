import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { json } from 'body-parser'
import * as compression from 'compression'
import 'dotenv/config'
import { join } from 'path'
import { AppModule } from './app.module'
import { Logger } from './shared/logger'
import { setupSwagger } from './swagger'

async function bootstrap() {
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

  setupSwagger(app)

  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 8080

  await app.listen(port, () => {
    const url = `http://${host}:${port}`
    logger.log(`🚀 Server listening on ${url}`)
    logger.log(`📄 Docs: ${url}/docs`)
  })
}

bootstrap()
