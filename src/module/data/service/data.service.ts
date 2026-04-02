import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import axios from 'axios'
import { Logger } from '../../../shared/logger'

interface GetOpts<T> {
  transformRemoteResponse?: (data: any) => T
}

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name)

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  public async getData<T = any>(
    key: string,
    url: string,
    opts?: GetOpts<T>,
  ): Promise<T> {
    let res: T | undefined

    if (!res) {
      try {
        res = await this.cache.get<T>(key)
      } catch (error) {
        this.logger.warn(`getData#local: ${error.message} | ${JSON.stringify({ key, url })}`)
      }
    }

    if (!res) {
      try {
        const { data } = await axios.get(url)
        if (opts?.transformRemoteResponse) {
          res = opts.transformRemoteResponse(data)
        } else {
          res = data
        }
        await this.cache.set(key, res)
      } catch (error) {
        this.logger.warn(`getData#remote: ${error.message} | ${JSON.stringify({ key, url })}`)
      }
    }

    return res as T
  }
}
