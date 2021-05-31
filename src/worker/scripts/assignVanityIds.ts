import { createConnection } from 'typeorm'
import logger from '../../lib/logger'

createConnection().then(async connection => {
  const lastAssignedIdQuery = await connection.manager.query('SELECT MAX("vanityId") FROM submission')
  let lastAssignedId = lastAssignedIdQuery?.[0]?.max
  if (lastAssignedId === null) {
    lastAssignedId = 0
  }

  logger.info(`Checking for submissions that need vanityIds - last vanityId was ${parseInt(lastAssignedId)}`)

  const ethAddressesToAssign = await connection.manager.query(`
        SELECT
            ra. "submissionEthAddress" AS "ethAddress"
        FROM ( SELECT DISTINCT ON (c. "submissionEthAddress")
                c. "submissionEthAddress",
                c. "networkAt" AS "registeredAt",
                s. "networkCreationAt"
            FROM
                submission_status_change AS c
            LEFT JOIN submission AS s ON c. "submissionEthAddress" = s. "ethAddress"
        WHERE
            c. "newStatus" = 'REGISTERED'
            AND s. "vanityId" IS NULL
            AND s. "networkSubmissionAt" IS NOT NULL
        ORDER BY
            c. "submissionEthAddress",
            c. "networkAt" ASC) AS ra
        ORDER BY
            ra. "registeredAt",
            ra. "networkCreationAt",
            ra. "submissionEthAddress" ASC
    `)

  ethAddressesToAssign.forEach((row, index) => {
    ethAddressesToAssign[index].vanityId = ++lastAssignedId
  })

  await Promise.all(ethAddressesToAssign.map(async row => {
    return await connection.manager.query('UPDATE submission SET "vanityId" = $2::integer WHERE "ethAddress" = $1::text', Object.values(row))
  }))

  logger.info(`Assigned vanityIds to ${parseInt(ethAddressesToAssign.length)} submissions`)

  await connection.close()
}).catch(err => {
  logger.error(err)
  process.exit(1)
})
