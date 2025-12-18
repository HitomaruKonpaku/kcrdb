import { Transform } from 'class-transformer'
import { ArrayUtil } from '../util/array.util'

export const ToArray = () => Transform(({ value }) => ArrayUtil.parse(value))
