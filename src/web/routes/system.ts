import { FastifyInstance } from 'fastify'

async function routes (fastify: FastifyInstance, options): Promise<void> {
  fastify.get('/ping', async (request, reply) => {
    return 'pong'
  })
}

export default routes
