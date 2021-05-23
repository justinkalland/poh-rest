import { createConnection } from 'typeorm'
import logger from '../../lib/logger'
import graph from '../lib/graph'

createConnection().then(async connection => {
  logger.info('Fetching and processing the entire graph!!!')
  await graph.fetchAndProcessAllRequests()
  await connection.close()
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
