import { FastifyInstance } from 'fastify'
import Schemas from '../Schemas'

import { Status } from '../../entities/Status'

async function routes (fastify: FastifyInstance, options): Promise<void> {
  fastify.get('/status', {
    schema: {
      description: 'The most recent statuses of the registry (and in the future other related data)',
      tags: ['status'],
      response: {
        200: Schemas.status
      }
    }
  }, async (request, reply) => {
    const status = await Status.findMostRecent()

    return status.toPublicStatus()
  })
}

export default routes
