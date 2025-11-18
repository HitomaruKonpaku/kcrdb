import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../dto/paging.dto'

export class QueryBuilderUtil {
  public static applyQueryPaging(
    qb: SelectQueryBuilder<any>,
    paging?: PagingDto,
  ) {
    if (paging?.offset !== undefined) {
      qb.offset(paging.offset)
    }
    if (paging?.limit !== undefined) {
      qb.limit(paging.limit)
    }
  }
}
