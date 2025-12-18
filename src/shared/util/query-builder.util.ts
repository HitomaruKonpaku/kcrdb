import { SelectQueryBuilder } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { PagingDto } from '../dto/paging.dto'
import { TimeFilterDto } from '../dto/time-filter.dto'

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

  public static applyQueryTimeFilter(
    qb: SelectQueryBuilder<BaseEntity>,
    timeFilter?: TimeFilterDto,
  ) {
    if (timeFilter?.before !== undefined) {
      qb.andWhere(`${qb.alias}.created_at <= :before`, { before: timeFilter.before })
    }
    if (timeFilter?.after !== undefined) {
      qb.andWhere(`${qb.alias}.created_at >= :after`, { after: timeFilter.after })
    }
  }
}
