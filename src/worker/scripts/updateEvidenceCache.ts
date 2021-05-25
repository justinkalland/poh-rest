import { createConnection } from 'typeorm'
import logger from '../../lib/logger'
import ipfs from '../../lib/ipfs'

import { Evidence } from '../../entities/Evidence'

createConnection().then(async connection => {
  const evidenceToUpdate = await Evidence.find({ where: { isJson: null }, order: { networkCreationAt: 'ASC' } })
  logger.info(`Updating cache on ${evidenceToUpdate.length} pieces of evidence`)

  await Promise.all(evidenceToUpdate.map(async evidence => {
    const data = await ipfs.fetchJsonData(evidence.uri)

    evidence.isRegistration = false

    if (data === undefined) {
      evidence.isJson = false
      return await evidence.save()
    }

    evidence.isJson = true
    evidence.cache = data

    if (data?.name !== 'Registration') {
      return await evidence.save()
    }

    const childData = await ipfs.fetchJsonData(data?.fileURI)
    if (childData === undefined) {
      return await evidence.save()
    }

    if (evidence.sentBySelf) {
      evidence.isRegistration = true
    }

    evidence.cache = { ...data, childData }
    return await evidence.save()
  }))

  await Promise.all(evidenceToUpdate.map(async evidence => {
    if (!evidence.isRegistration) {
      return await Promise.resolve()
    }

    const submission = await evidence.submission
    submission.displayName = evidence.cache.childData.name
    submission.firstName = evidence.cache.childData.firstName
    submission.lastName = evidence.cache.childData.lastName
    submission.photoUri = evidence.cache.childData.photo
    submission.videoUri = evidence.cache.childData.video
    submission.bio = evidence.cache.childData.bio

    return await submission.save()
  }))

  await connection.close()
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
