import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

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
