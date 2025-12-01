export default () => ({
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5432/postgres',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: process.env.CACHE_TTL || '1m',
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'kcrdb_secret',
})
