import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import FastifySwagger from 'fastify-swagger'
import FastifyCors from 'fastify-cors'
import { createConnection } from 'typeorm'
import logger from '../lib/logger'

import SystemRoutes from './routes/system'
import ProfilesRoutes from './routes/profiles'
import StatusRoutes from './routes/status'
import DocsRoutes, { fastifySwaggerOptions } from './routes/docs'

const fastify: FastifyInstance = Fastify({ logger })

createConnection().then(async connection => {
  if (process.env.PORT === undefined) {
    throw new Error('Environment variable PORT is required.')
  }
  await fastify.register(FastifyCors)
  await fastify.register(FastifySwagger, fastifySwaggerOptions)

  await fastify.register(DocsRoutes)
  await fastify.register(SystemRoutes)
  await fastify.register(ProfilesRoutes)
  await fastify.register(StatusRoutes)

  return await fastify.listen(process.env.PORT, '0.0.0.0')
}).catch(err => {
  fastify.log.error(err)
  process.exit(1)
})
