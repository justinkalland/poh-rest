import 'dotenv/config'
import Pino from 'pino'
const pino = Pino({
  level: process.env.LOG_LEVEL ?? 'info',
  prettyPrint: process[Symbol.for('ts-node.register.instance')]
})

export default pino
