import { FastifyInstance } from 'fastify'

async function routes (fastify: FastifyInstance, options): Promise<void> {
  fastify.all('/', async (request, reply) => {
    return await reply.redirect('/docs')
  })

  fastify.get('/ping', {
    schema: {
      description: 'Simple endpoint to check if the service is running',
      tags: ['system'],
      response: {
        200: {
          description: 'Service responded',
          type: 'string',
          example: 'pong'
        }
      }
    }
  }, async (request, reply) => {
    return 'pong'
  })
}

export default routes
