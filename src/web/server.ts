import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import FastifySwagger from 'fastify-swagger'
import FastifyCors from 'fastify-cors'
import { createConnection } from 'typeorm'
import logger from '../lib/logger'

import SystemRoutes from './routes/system'
import ProfilesRoutes from './routes/profiles'

const fastify: FastifyInstance = Fastify({ logger })

createConnection().then(async connection => {
  if (process.env.PORT === undefined) {
    throw new Error('Environment variable PORT is required.')
  }

  await fastify.register(FastifyCors)
  // @ts-expect-error temporary ignore because hideUntagged is missing from types: https://github.com/fastify/fastify-swagger/pull/414
  await fastify.register(FastifySwagger, {
    openapi: {
      info: {
        title: 'Proof of Humanity REST',
        description: 'Fast simple centralized REST API to fetch data from the Proof of Humanity protocol and ecosystem',
        version: '0.1.0'
      },
      servers: [{
        // todo: this violates the III of The Twelve Factors, should be moved to the environment
        url: process.env.NODE_ENV === 'production' ? 'https://api.poh.dev' : `http://0.0.0.0:${process.env.PORT}`
      }],
      tags: [
        {
          name: 'profiles',
          description: ''
        }, {
          name: 'system',
          description: ''
        }
      ]
    },
    routePrefix: '/docs',
    exposeRoute: true,
    hideUntagged: true
  })

  await fastify.register(SystemRoutes)
  await fastify.register(ProfilesRoutes)

  // todo: this violates the III of The Twelve Factors, should be moved to the environment
  return await fastify.listen(process.env.PORT, '0.0.0.0')
}).catch(err => {
  fastify.log.error(err)
  process.exit(1)
})
