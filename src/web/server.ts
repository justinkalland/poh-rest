import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import { createConnection } from 'typeorm'
import logger from '../lib/logger'

import SystemRoutes from './routes/system'

const fastify: FastifyInstance = Fastify({ logger })

createConnection().then(async connection => {
  await fastify.register(SystemRoutes)

  if (process.env.PORT === undefined) {
    throw new Error('Environment variable PORT is required.')
  }
  return await fastify.listen(process.env.PORT, '0.0.0.0')
}).catch(err => {
  fastify.log.error(err)
  process.exit(1)
})
