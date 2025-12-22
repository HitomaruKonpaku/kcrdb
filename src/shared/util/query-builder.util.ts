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

  public static applyQueryMatchFilter(
    qb: SelectQueryBuilder<BaseEntity>,
    allowFields: string[],
    filter?: Record<string, any>,
  ) {
    allowFields.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        if (Array.isArray(filter[key])) {
          if (filter[key].length) {
            qb.andWhere(`${qb.alias}.${key} IN (:...${key})`, { [key]: filter[key] })
          }
        } else {
          qb.andWhere(`${qb.alias}.${key} = :${key}`, { [key]: filter[key] })
        }
      }
    })
  }

  public static applyQueryLikeFilter(
    qb: SelectQueryBuilder<BaseEntity>,
    allowFields: string[],
    filter?: Record<string, any>,
  ) {
    allowFields.forEach((key) => {
      if (filter && filter[key] !== undefined) {
        qb.andWhere(`q.${key} ILIKE :${key}`, { [key]: `%${filter[key]}%` })
      }
    })
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

    const regex = /^([+-]{0,1})([\w]+)([+-]{0,1})$/
    const allKeys = new Set(allowFields)
    const sortKeys = new Set()

    sorts.forEach((key) => {
      const matchArr = key.match(regex)
      if (!matchArr) {
        return
      }

      const sortKey = matchArr[2]
      let sortDirection: 'ASC' | 'DESC' = 'ASC'
      let sortNulls: 'NULLS FIRST' | 'NULLS LAST' = 'NULLS LAST'
      if (!allKeys.has(sortKey)) {
        return
      }

      if (matchArr[1] === '-') {
        sortDirection = 'DESC'
      }

      if (matchArr[3] === '-') {
        sortNulls = 'NULLS FIRST'
      }

      qb.addOrderBy(`${qb.alias}.${sortKey}`, sortDirection, sortNulls)
      sortKeys.add(sortKey)
    })

    if (!sortKeys.has('created_at')) {
      qb.addOrderBy(`${qb.alias}.created_at`, 'DESC')
    }
  }
}
