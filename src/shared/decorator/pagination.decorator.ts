import { Type, applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

export const ApiPaginatedResponse = <T extends Type<unknown>>(dataType: T) => applyDecorators(
  ApiExtraModels(dataType),
  ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            total: {
              type: 'number',
            },
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(dataType) },
            },
          },
        },
      ],
    },
  }),
)

export const ApiPaginatedWithMetadataResponse = <T extends Type<unknown>, M extends Type<unknown>>(dataType: T, metadataType: M) => applyDecorators(
  ApiExtraModels(dataType),
  ApiExtraModels(metadataType),
  ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            total: {
              type: 'number',
            },
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(dataType) },
            },
            metadata: {
              $ref: getSchemaPath(metadataType),
            },
          },
        },
      ],
    },
  }),
)

export const ApiPaginatedCreatedResponse = () => applyDecorators(
  ApiCreatedResponse({
    schema: {
      allOf: [
        {
          properties: {
            total: {
              type: 'number',
            },
            ids: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      ],
    },
  }),
)
