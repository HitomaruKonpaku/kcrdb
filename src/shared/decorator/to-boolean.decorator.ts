import { Transform } from 'class-transformer'

export const ToBoolean = () => Transform(({ value }) => (
  {
    1: true,
    0: false,
    true: true,
    false: false,
  }[value]
))
