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

  public static applyQuerySort(
    qb: SelectQueryBuilder<BaseEntity>,
    allowFields: string[],
    sorts?: string[],
  ) {
    if (sorts === undefined) {
      qb.addOrderBy(`${qb.alias}.created_at`, 'DESC')
      return
    }

    const allKeys = new Set(allowFields)
    const sortKeys = new Set()

    sorts.forEach((key) => {
      let sortKey = key
      let sortDirection: 'ASC' | 'DESC' = 'ASC'

      if (key.startsWith('-')) {
        sortKey = key.substring(1)
        sortDirection = 'DESC'
      }

      if (!allKeys.has(sortKey)) {
        return
      }

      sortKeys.add(sortKey)
      qb.addOrderBy(`${qb.alias}.${sortKey}`, sortDirection)
    })

    if (!sortKeys.has('created_at')) {
      qb.addOrderBy(`${qb.alias}.created_at`, 'DESC')
    }
  }
}
