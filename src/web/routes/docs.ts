import { FastifyInstance } from 'fastify'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const fastifySwaggerOptions = {
  openapi: {
    info: {
      title: 'Proof of Humanity REST',
      description: 'Fast simple centralized REST API to fetch data from the Proof of Humanity protocol and ecosystem',
      version: '0.1.0'
    },
    servers: [{
      url: process.env.SELF_BASE === undefined ? '' : process.env.SELF_BASE
    }],
    tags: [
      {
        name: 'status',
        description: 'Status of the registry and ecosystem'
      }, {
        name: 'profiles',
        description: 'Details on humans that have used the registery'
      }, {
        name: 'system',
        description: ''
      }
    ]
  },
  routePrefix: '/docs',
  exposeRoute: true,
  hideUntagged: true
}

async function routes (fastify: FastifyInstance, options): Promise<void> {
  // Hackish way to inject some CSS to hide the ugly header from swagger-ui
  fastify.get('/docs/static/swagger-ui.css', async (request, reply) => {
    const css = await readFile(join(__dirname, '../../../node_modules/fastify-swagger/static/swagger-ui.css'))
    await reply.type('text/css').send(css.toString() + '.topbar{display: none}.main .url{display: none}')
  })
}

export default routes
