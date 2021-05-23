import { Logger, QueryRunner } from 'typeorm'
import pino from './logger'

export default class PinoLoggerTypeORM implements Logger {
  logQuery (query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    pino.debug({ query, parameters }, 'DB QUERY')
  }

  logQueryError (error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (typeof error === 'object') {
      pino.error({
        error,
        query,
        parameters
      }, `${error.name}: ${error.message}`)
    } else {
      pino.error({
        query,
        parameters
      }, error)
    }
  }

  logQuerySlow (time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    pino.warn({
      query,
      parameters
    }, `DB SLOW QUERY: ${time}`)
  }

  logSchemaBuild (message: string, queryRunner?: QueryRunner): any {
    pino.debug(message)
  }

  logMigration (message: string, queryRunner?: QueryRunner): any {
    pino.debug(message)
  }

  log (level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    switch (level) {
      case 'info':
        // these messages are annoying and shouldn't be INFO level
        if (message.includes('provided glob pattern') === true) {
          break
        }
        pino.info(message)
        break
      case 'warn':
        pino.warn(message)
        break
      case 'log':
        pino.info(message)
        break
    }
  }
}
