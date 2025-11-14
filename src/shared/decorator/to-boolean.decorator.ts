import { Transform } from 'class-transformer'

export const ToBoolean = () => Transform(({ value }) => {
  const dict = {
    1: true,
    0: false,
    true: true,
    false: false,
  }
  return dict[value]
})
