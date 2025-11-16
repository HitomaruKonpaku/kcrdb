import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../dto/paging.dto'

export class QueryBuilderUtil {
  public static applyQueryPaging(
    qb: SelectQueryBuilder<any>,
    paging?: PagingDto,
  ) {
    if (paging?.offset !== undefined) {
      qb.skip(paging.offset)
    }
    if (paging?.limit !== undefined) {
      qb.take(paging.limit)
    }
  }
}
