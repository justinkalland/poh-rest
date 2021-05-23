const join = require('path').join

const options = {
  type: process.env.DATABASE_URL.split('://')[0],
  url: process.env.DATABASE_URL,
  logging: false,
  logger: 'debug',
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  }
}

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false }
}

let PinoLoggerTypeORM

// If running as type script through ts-node
if (process[Symbol.for('ts-node.register.instance')]) {
  options.entities = ['src/entities/**/*.ts']
  options.subscribers = ['src/subscribers/**/*.ts']
  options.migrations = ['src/migrations/**/*.ts']
  PinoLoggerTypeORM = require(join(__dirname, '/src/lib/PinoLoggerTypeORM.ts')).default
} else {
  options.entities = ['dist/entities/**/*.js']
  options.subscribers = ['dist/subscribers/**/*.js']
  options.migrations = ['dist/migrations/**/*.js']
  PinoLoggerTypeORM = require(join(__dirname, '/dist/lib/PinoLoggerTypeORM.js')).default
}

options.logger = new PinoLoggerTypeORM()

module.exports = options
