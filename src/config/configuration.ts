/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as ms from 'ms'
import { StringValue } from 'ms'

const cfg = {
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/postgres',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  // @ts-ignore
  CACHE_TTL: ms(<StringValue>(process.env.CACHE_TTL || '1m')),
  // @ts-ignore
  QUEST_TTL: ms(<StringValue>(process.env.QUEST_TTL || '1m')),
  // @ts-ignore
  KCSAPI_TTL: ms(<StringValue>(process.env.KCSAPI_TTL || '1m')),
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'kcrdb_secret',
}

// console.debug(cfg)

export default () => cfg
