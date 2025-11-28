import { UseInterceptors, applyDecorators } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { UserAgentInterceptor } from '../module/user-agent/interceptor/user-agent.interceptor'

export const TrackUserAgent = () => applyDecorators(
  UseInterceptors(UserAgentInterceptor),
  ApiHeader({
    name: 'x-origin',
    description: 'Client origin',
    required: false,
  }),
  ApiHeader({
    name: 'x-version',
    description: 'Client version',
    required: false,
  }),
)
