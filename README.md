# kcrdb

KanColle Replay DB

## Environment

| Name              | Desc                  | Default                                             |
|-------------------|-----------------------|-----------------------------------------------------|
| PORT              |                       | 8080                                                |
| DATABASE_TYPE     |                       | postgres                                            |
| DATABASE_URL      |                       | postgresql://postgres:admin@localhost:5432/postgres |
| REDIS_URL         |                       | redis://localhost:6379                              |
| CACHE_TTL         |                       | 1m                                                  |
| NO_COLOR          | Disable log color     |                                                     |
| NO_TIMESTAMP      | Disable log timestamp |                                                     |
| BODY_JSON_LIMIT   |                       | 500kb                                               |
| METRICS_ENABLED   |                       | 0 (false)                                           |
| METRICS_PORT      |                       | 8081                                                |
| ENCRYPTION_SECRET |                       | kcrdb_secret                                        |

## Related

- [kancolle-replay](https://github.com/KC3Kai/kancolle-replay)
- [KC3Kai](https://github.com/KC3Kai/KC3Kai)
