import { ValueTransformer } from 'typeorm'

export const BigIntTransformer: ValueTransformer = {
  to(value: any) {
    return value
  },

  from(value: any) {
    return Number(value)
  },
}
