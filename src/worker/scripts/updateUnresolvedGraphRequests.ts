import { createConnection, Not, In } from 'typeorm'
import logger from '../../lib/logger'
import graph from '../lib/graph'

import { Request } from '../../entities/Request'

createConnection().then(async connection => {
  const updatedRequestIds = await graph.fetchAndProcessUnresolvedRequests()
  logger.info(`Ran ${updatedRequestIds.length} unresolved requests from the graph`)

  const staleUnresolvedRequests = await Request.find({
    where: {
      resolved: false,
      id: Not(In(updatedRequestIds))
    },
    select: ['id']
  })

  const staleUpdatedRequestIds = await graph.fetchAndProcessRequestsByIds(staleUnresolvedRequests.map(request => request.id))
  logger.info(`Ran ${staleUpdatedRequestIds.length} stale unresolved requests`)

  await connection.close()
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
