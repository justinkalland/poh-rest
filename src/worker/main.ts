import 'dotenv/config'
import { createConnection } from 'typeorm'
import logger from '../lib/logger'
import { fork, MessagingOptions, ProcessEnvOptions } from 'child_process'
import { join } from 'path'
import schedule from 'node-schedule'
import { Abortable } from 'events'

const BASE_DIR = join(__dirname, 'scripts/')
const runningScripts = new Set()

// fork timeout was added in node 15.13 - @types hasn't caught up yet
declare module 'child_process' {
  interface ForkOptions extends ProcessEnvOptions, MessagingOptions, Abortable {
    timeout?: number
  }
}

async function forkIfNotRunning (scriptName: string): Promise<number> {
  if (runningScripts.has(scriptName)) {
    logger.info(`${scriptName} is still running, skipping`)
    return -1
  }
  runningScripts.add(scriptName)

  logger.info(`${scriptName} starting`)
  const process = fork(join(BASE_DIR, scriptName), [], { timeout: 60000 })

  return await new Promise(resolve => {
    process.on('exit', code => {
      runningScripts.delete(scriptName)

      if (code === null) {
        code = -1
      }

      if (code === 0) {
        logger.info(`${scriptName} finished with code ${code}`)
      } else {
        logger.warn(`${scriptName} finished with code ${code}`)
      }
      resolve(code)
    })
  })
}

createConnection().then(async connection => {
  schedule.scheduleJob('*/5 * * * * *', async () => {
    await forkIfNotRunning('updateStatus')
  })
  schedule.scheduleJob('*/10 * * * * *', async () => {
    await forkIfNotRunning('updateUnresolvedGraphRequests').then(async code => {
      if (code !== -1) {
        await forkIfNotRunning('updateEvidenceCache')
      }
    })
  })
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
