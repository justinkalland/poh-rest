import { FastifyInstance } from 'fastify'
import Schemas from '../Schemas'

import { Submission } from '../../entities/Submission'
import { URL } from 'url'
import { SubmissionStatusChange } from '../../entities/SubmissionStatusChange'

const PAGE_SIZE = 100

async function routes (fastify: FastifyInstance, options): Promise<void> {
  fastify.get<{
    Params: { eth_address: string }
  }>('/profiles/:eth_address', {
    schema: {
      description: 'Profile data for given Ethereum address',
      tags: ['profiles'],
      params: {
        type: 'object',
        required: ['eth_address'],
        properties: { ...Schemas.ethAddressProperty }
      },
      response: {
        200: Schemas.profile
      }
    }
  }, async (request, reply) => {
    const submission = await Submission.findOne(request.params.eth_address)

    if (submission === undefined) {
      return reply.callNotFound()
    }

    return submission.toPublicProfile()
  })

  fastify.get<{
    Params: { eth_address: string }
  }>('/profiles/:eth_address/status-history', {
    schema: {
      description: 'Historic status changes of a profile',
      tags: ['profiles'],
      params: {
        type: 'object',
        required: ['eth_address'],
        properties: { ...Schemas.ethAddressProperty }
      },
      response: {
        200: Schemas.profileStatusHistory
      }
    }
  }, async (request, reply) => {
    const submissionStatusChanges = await SubmissionStatusChange.find({ where: { submissionEthAddress: request.params.eth_address }, order: { networkAt: 'ASC' } })

    if (submissionStatusChanges.length === 0) {
      return reply.callNotFound()
    }

    return submissionStatusChanges.map(change => change.toPublicStatusChange())
  })

  fastify.get<{
    Querystring: {
      order_by: string
      order_direction: string
      include_unregistered: boolean
      start_cursor: string
    }
  }>('/profiles', {
    schema: {
      description: 'List of all profiles - paginated with 100 per page',
      tags: ['profiles'],
      querystring: {
        type: 'object',
        properties: {
          ...Schemas.orderedWithCursorProperties(['registered_time', 'creation_time']),
          include_unregistered: {
            type: 'boolean',
            description: 'Include profiles that are not registered. If sorting by registeredTime this parameter is ignored.',
            default: false
          }
        }
      },
      response: {
        200: {
          profiles: Schemas.profiles,
          meta: Schemas.paginatedMeta
        }
      }
    }
  }, async (request, reply) => {
    const orderDirection = request.query.order_direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    let orderBy = 'networkCreationAt'
    let includeUnregistered = request.query.include_unregistered
    if (request.query.order_by === 'registered_time') {
      orderBy = 'networkSubmissionAt'
      includeUnregistered = false
    }

    const { results: submissions, hasMore, nextCursor } = await Submission.findCursorPaginated({
      take: PAGE_SIZE,
      orderBy,
      orderDirection,
      startCursor: request.query.start_cursor,
      where: includeUnregistered ? undefined : { currentlyRegistered: true }
    })

    let nextUrl: string | undefined
    if (hasMore && nextCursor !== undefined) {
      const url = new URL(request.url, process.env.SELF_BASE)
      url.searchParams.set('start_cursor', nextCursor)
      nextUrl = url.toString()
    }

    return {
      profiles: submissions.map(submission => submission.toPublicProfile()),
      meta: {
        has_more: hasMore,
        next_cursor: nextCursor,
        next_url: nextUrl
      }
    }
  })
}

export default routes
