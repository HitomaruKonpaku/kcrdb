import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { API_KEY_HEADER_NAME } from '../constant/common.constant'
import { TokenGuard } from '../module/token/guard/token.guard'

export const UseTokenGuard = () => applyDecorators(
  UseGuards(TokenGuard),
  ApiSecurity(API_KEY_HEADER_NAME),
  ApiUnauthorizedResponse({ description: '<code>x-api-key</code> missing or invalid' }),
  ApiForbiddenResponse({ description: 'Forbidden' }),
)
