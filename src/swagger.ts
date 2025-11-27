import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { API_KEY_HEADER_NAME } from './constant/common.constant'

export function setupSwagger<T>(app: INestApplication<T>) {
  const title = 'KCRDB API'
  const description = 'KanColle Replay DB'

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addTag('replay')
    .addTag('simulator')
    .addTag('quest')
    .addTag('quest-item')
    .addTag('kcsapi')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: API_KEY_HEADER_NAME,
      },
      API_KEY_HEADER_NAME,
    )
    .addGlobalParameters(
      {
        in: 'header',
        name: 'x-origin',
        description: 'Client origin',
        required: false,
      },
      {
        in: 'header',
        name: 'x-version',
        description: 'Client version',
        required: false,
      },
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: title,
    swaggerOptions: {
      filter: true,
      persistAuthorization: true,
      defaultModelsExpandDepth: 0,
    },
  })
}
