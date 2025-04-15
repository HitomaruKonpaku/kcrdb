import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'body-parser'
import 'dotenv/config'
import { join } from 'path'
import { AppModule } from './app.module'
import { Logger } from './shared/logger'

function setupSwagger<T>(app: INestApplication<T>) {
  const title = 'KCRDB API'
  const description = 'KanColle Replay DB'
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: title,
  })
}

async function bootstrap() {
  const logger = new Logger('Main')

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger(),
  })

  app.enableCors()
  app.enableShutdownHooks()

  app.set('trust proxy', true)

  app.use(json({ limit: '20mb' }))

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
