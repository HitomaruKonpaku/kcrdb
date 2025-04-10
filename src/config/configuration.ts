export default () => ({
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgresql://postgres:admin@localhost:5432/postgres',
})
