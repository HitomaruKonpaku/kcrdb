import { Transform } from 'class-transformer'

export const ToNumber = () => Transform(({ value }) => {
  if (Array.isArray(value)) {
    return value.map((v) => Number(v))
  }
  return Number(value)
})
