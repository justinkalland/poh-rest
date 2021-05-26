import { createConnection } from 'typeorm'
import logger from '../../lib/logger'

import { Status } from '../../entities/Status'
import { Submission, SubmissionStatus } from '../../entities/Submission'

createConnection().then(async connection => {
  const status = Status.createForPeriod('hour')

  const total = await Submission.count()

  const registered = await Submission.count({
    where: { currentlyRegistered: true }
  })

  const pendingRemoval = {
    total: 0,
    challenged: await Submission.count({
      where: { status: SubmissionStatus.DISPUTED_PENDING_REMOVAL_REQUEST }
    }),
    notChallenged: await Submission.count({
      where: { status: SubmissionStatus.PENDING_REMOVAL_REQUEST }
    })
  }
  pendingRemoval.total = pendingRemoval.challenged + pendingRemoval.notChallenged

  const pendingRegistration = {
    total: 0,
    challenged: await Submission.count({
      where: { status: SubmissionStatus.DISPUTED_PENDING_REGISTRATION_REQUEST }
    }),
    notChallenged: await Submission.count({
      where: { status: SubmissionStatus.PENDING_REGISTRATION_REQUEST }
    })
  }
  pendingRegistration.total = pendingRegistration.challenged + pendingRegistration.notChallenged

  const expired = await Submission.count({
    where: { status: SubmissionStatus.EXPIRED }
  })

  const removed = await Submission.count({
    where: { status: SubmissionStatus.REMOVED }
  })

  status.registry = {
    total,
    registered,
    pendingRemoval,
    pendingRegistration,
    expired,
    removed
  }

  await status.save()
  await connection.close()
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
