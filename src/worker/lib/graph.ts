import logger from '../../lib/logger'
import axios from 'axios'
import { uniqBy } from 'lodash'
import { Request } from '../../entities/Request'
import { Evidence } from '../../entities/Evidence'
import { Submission, SubmissionStatus } from '../../entities/Submission'

const PAGE_SIZE = 1000

async function fetchRequests (where = {}): Promise<Array<{}>> {
  let requests: Array<{}> = []
  let creationTimeOffset = Math.floor(Date.now() / 1000)

  while (creationTimeOffset > 0) {
    logger.debug(where, `Fetching ${PAGE_SIZE} requests starting at ${creationTimeOffset}`)

    const stringWhere = JSON.stringify({
      ...where,
      creationTime_lte: creationTimeOffset
    }).replace(/"([^"]+)":/g, '$1:')
    const response = await axios.post('https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet', {
      query: `
            {
              requests(first: ${PAGE_SIZE}, orderBy: creationTime, orderDirection: desc, where: ${stringWhere}) {
                id
                submission {
                  id
                  creationTime
                  status
                  registered
                  submissionTime
                  name
                  vouchesReceivedLength
                  disputed
                  requestsLength
                }
                creationTime
                disputed
                lastStatusChange
                resolved
                requester
                vouches {
                  id
                }
                usedReasons
                currentReason
                requesterLost
                registration
                evidence {
                  id
                  creationTime
                  URI
                  sender
                  request {
                    id
                    submission {
                      id
                    }
                  }
                }
              }
            }
        `
    })

    if (response.data?.data?.requests === undefined) {
      logger.error(response.data, 'No responses returned from Subgraph.')
      creationTimeOffset = 0
      continue
    }

    requests = [...requests, ...response.data.data.requests]

    if (response.data.data.requests.length === PAGE_SIZE) {
      creationTimeOffset = response.data.data.requests.pop().creationTime
    } else {
      creationTimeOffset = 0
    }
  }

  requests = uniqBy(requests, (request: any) => request.id)

  logger.debug(`Fetched ${requests.length} requests`)

  return requests
}

async function processRequest (requestData): Promise<Request> {
  const request = new Request()
  request.submissionEthAddress = requestData.submission.id
  request.id = requestData.id
  request.resolved = requestData.resolved
  request.disputed = requestData.disputed
  if (requestData.registration === true) {
    request.isRegistration = true
  } else {
    request.isRegistration = false
  }
  request.networkCreationAt = new Date(requestData.creationTime * 1000)
  request.networkLastChangeAt = new Date(requestData.lastStatusChange * 1000)
  request.requesterEthAddress = requestData.requester
  request.requesterLost = requestData.requesterLost
  await request.save()
  return request
}

async function processEvidence (evidenceData): Promise<Evidence> {
  const evidence = new Evidence()
  evidence.id = evidenceData.id
  evidence.senderEthAddress = evidenceData.sender
  evidence.uri = evidenceData.URI
  evidence.networkCreationAt = new Date(evidenceData.creationTime * 1000)
  evidence.requestId = evidenceData.request.id
  evidence.submissionEthAddress = evidenceData.request.submission.id
  await evidence.save()

  return evidence
}

async function processSubmission (submissionData): Promise<Submission> {
  const submission = new Submission()
  submission.ethAddress = submissionData.id
  submission.displayName = submissionData.name
  submission.currentlyRegistered = submissionData.registered
  submission.networkCreationAt = new Date(submissionData.creationTime * 1000)
  if (submissionData.submissionTime > 0) {
    submission.networkSubmissionAt = new Date(submissionData.submissionTime * 1000)
  }
  switch (submissionData.status) {
    case 'Vouching':
      submission.status = SubmissionStatus.VOUCHING
      break
    case 'PendingRegistration':
      if (submissionData.disputed === true) {
        submission.status = SubmissionStatus.DISPUTED_PENDING_REGISTRATION_REQUEST
      } else {
        submission.status = SubmissionStatus.PENDING_REGISTRATION_REQUEST
      }
      break
    case 'PendingRemoval':
      if (submissionData.disputed === true) {
        submission.status = SubmissionStatus.DISPUTED_PENDING_REMOVAL_REQUEST
      } else {
        submission.status = SubmissionStatus.PENDING_REMOVAL_REQUEST
      }
      break
    default:
      if (submissionData.registered === true) {
        submission.status = SubmissionStatus.REGISTERED
      } else {
        submission.status = SubmissionStatus.REMOVED
      }
        // todo: what about expired status?
  }
  await submission.save()
  return submission
}

async function deepProcessRequests (requestsData): Promise<[string]> {
  const submissionsData = uniqBy(requestsData.map((request: any) => request.submission), (submissionData: any) => submissionData.id)
  const evidenceData = requestsData.map((request: any) => request.evidence).flat()
  await Promise.all(submissionsData.map(processSubmission))
  await Promise.all(requestsData.map(processRequest))
  await Promise.all(evidenceData.map(processEvidence))
  return requestsData.map(data => data.id)
}

async function fetchAndProcessAllRequests (): Promise<[string]> {
  const requestsData = await fetchRequests()
  return await deepProcessRequests(requestsData)
}

async function fetchAndProcessUnresolvedRequests (): Promise<[string]> {
  const requestsData = await fetchRequests({ resolved: false })
  return await deepProcessRequests(requestsData)
}

async function fetchAndProcessRequestsByIds (ids: string[]): Promise<[string]> {
  const requestsData = await fetchRequests({ id_in: ids })
  return await deepProcessRequests(requestsData)
}

export default {
  fetchAndProcessAllRequests,
  fetchAndProcessUnresolvedRequests,
  fetchAndProcessRequestsByIds
}
