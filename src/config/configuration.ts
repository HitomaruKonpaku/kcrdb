/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as ms from 'ms'
import { StringValue } from 'ms'

const ttl = (key: string, defaultValue: StringValue = '1m') => {
  try {
    // @ts-ignore
    return ms(<StringValue>(process.env[key]) || defaultValue)
  } catch {
    // @ts-ignore
    return ms(defaultValue)
  }
}

const cfg = {
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/postgres',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: ttl('CACHE_TTL'),
  KCSAPI_TTL: ttl('KCSAPI_TTL'),
  QUEST_TTL: ttl('QUEST_TTL'),
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'kcrdb_secret',
}

// console.debug(cfg)

export default () => cfg
