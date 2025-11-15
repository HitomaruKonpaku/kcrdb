import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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
      defaultModelsExpandDepth: 0,
    },
  })
}
