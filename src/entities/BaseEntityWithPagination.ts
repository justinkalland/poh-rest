import { BaseEntity, getConnection } from 'typeorm'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { ObjectType } from 'typeorm/common/ObjectType'

interface CursorPaginatedOptions {
  take: number
  orderBy: string
  orderDirection?: 'ASC' | 'DESC'
  startCursor?: string
  where?: ObjectLiteral
}

export default class BaseEntityWithPagination extends BaseEntity {
  /*
      Easy to use cursor based paginator - that supports string primary keys!
      Bunch of hacking here, requires deep understanding of TypeORM, contact justin@kalland.com if help is needed.

      Currently only supports timestamp orderBy columns
       */
  static async findCursorPaginated<T extends BaseEntityWithPagination>(this: ObjectType<T>, options: CursorPaginatedOptions): Promise<{
    results: T[]
    hasMore: boolean
    nextCursor: string | undefined
  }> {
    const self = this as any
    const orderDirection = options.orderDirection === 'ASC' ? 'ASC' : 'DESC'
    const orderBy = options.orderBy
    const take = options.take
    const hasCursor = options.startCursor !== undefined
    const startCursor = options.startCursor === undefined ? '' : options.startCursor
    const hasWhere = options.where !== undefined
    const where = options.where === undefined ? {} : options.where
    const primaryColumnName = getConnection().getMetadata(this).primaryColumns[0].propertyName
    // todo: this is fragile, better way to check if the type is a string?
    const primaryColumnType = getConnection().getMetadata(this).primaryColumns[0].type
    const primaryColumnIsString = ['citext', 'string'].includes(typeof primaryColumnType === 'string' ? primaryColumnType : '')

    const query = self.createQueryBuilder()
    query.orderBy(`${this.name}.${orderBy}`, orderDirection)
    query.addOrderBy(`${this.name}.${primaryColumnName}`, orderDirection)
    query.take(take + 1)

    let cursorWhereMethod = 'where'
    if (hasWhere) {
      query.where(where)
      cursorWhereMethod = 'andWhere'
    }
    if (hasCursor) {
      const cursorParts = Buffer.from(startCursor, 'base64url').toString('ascii').split('/')
      const compOperator = orderDirection === 'ASC' ? '>=' : '<='
      if (primaryColumnIsString) {
        // todo: this limits orderBy to timestamp fields, could be improved to support other types
        const firstW = new Date(parseInt(cursorParts[0]))
        const secondW = cursorParts[1]
        query[cursorWhereMethod](`(${this.name}.${orderBy}, ${this.name}.${primaryColumnName}) ${compOperator} (:firstW, :secondW)`, { firstW, secondW })
      } else {
        const firstW = cursorParts[0]
        query[cursorWhereMethod](`${this.name}.${primaryColumnName} ${compOperator} :firstW`, { firstW })
      }
    }

    const results = await query.getMany()

    let hasMore = false
    let nextCursor: string | undefined
    if (results.length === take + 1) {
      hasMore = true
      const nextResult = results.pop()
      if (primaryColumnIsString) {
        // todo: this limits orderBy to timestamp fields, could be improved to support other types
        const time: string = nextResult[orderBy].getTime()
        const id: string = nextResult[primaryColumnName]
        nextCursor = `${time}/${id}`
      } else {
        nextCursor = nextResult[primaryColumnName]
      }
      if (nextCursor !== undefined) {
        nextCursor = Buffer.from(nextCursor).toString('base64url')
      }
    }

    return {
      results,
      hasMore,
      nextCursor
    }
  }
}
