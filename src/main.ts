import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'body-parser'
import 'dotenv/config'
import { AppModule } from './app.module'
import { Logger } from './shared/logger'

async function bootstrap() {
  const logger = new Logger('Main')

  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  })

  app.enableCors()

  app.use(json({ limit: '20mb' }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  app.enableShutdownHooks()

  const config = new DocumentBuilder()
    .setTitle('KCRDB API')
    .setDescription('')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 8080

  await app.listen(port, () => {
    const url = `http://${host}:${port}`
    logger.log(`🚀 Server listening on ${url}`)
    logger.log(`📄 Docs: ${url}/docs`)
  })
}

bootstrap()
