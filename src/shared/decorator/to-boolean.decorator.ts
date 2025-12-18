import { Transform } from 'class-transformer'
import { BooleanUtil } from '../util/boolean.util'

export const ToBoolean = () => Transform(({ value }) => {
  if (Array.isArray(value)) {
    return value.map((v) => BooleanUtil.parse(v))
  }
  return BooleanUtil.parse(value)
})
