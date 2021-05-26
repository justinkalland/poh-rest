/*
    A quick justification on why I picked this direction:

    Using Fastify / TypeORM / Swagger UI / OpenAPI 3 all together can be powerful... and annoying
    Fastify uses its own schema for validation and serialization
    Fastify-Swagger compiles it into OpenAPI v3 to server via Swagger UI
    Fastify does provide a nice shared schema API: https://www.fastify.io/docs/master/Validation-and-Serialization/
    But it doesn't work great with Fastify-Swagger: https://github.com/Eomm/json-schema-resolver/pull/4
    So instead I opted to use shared schema objects.
    In the future we may want to transition to proper OpenAPI $ref schemas
 */

import { SubmissionStatus } from '../entities/Submission'

export const ethAddressProperty = {
  eth_address: {
    type: 'string',
    example: '0xf49a19f72d0e106df462cfd6b5bebe42b6001616',
    pattern: '^0x[a-fA-F0-9]{40}$'
  }
}

export const profile = {
  description: 'Profile (might not be registered)',
  type: 'object',
  properties: {
    ...ethAddressProperty,
    status: {
      type: 'string',
      enum: Object.keys(SubmissionStatus)
    },
    display_name: { type: 'string', example: 'satoshin' },
    first_name: { type: 'string', example: 'Satoshi' },
    last_name: { type: 'string', example: 'Nakamoto' },
    registered: { type: 'boolean' },
    photo: { type: 'string', example: 'https://ipfs.kleros.io/ipfs/QmXmLgii8brfAP7edaabbRHey5VKvFhqqpSFfJf4sD1Lf6/image.jpg' },
    video: { type: 'string', example: 'https://ipfs.kleros.io/ipfs/QmXmLgii8brfAP7edaabbRHey5VKvFhqqpSFfJf4sD1Lf6/video.mp4' },
    bio: { type: 'string', example: 'Chancellor on brink of second bailout for banks.' },
    profile: { type: 'string', example: 'https://app.proofofhumanity.id/profile/0xf49a19f72d0e106df462cfd6b5bebe42b6001615' },
    registered_time: { type: 'string', format: 'date-time' },
    creation_time: { type: 'string', format: 'date-time' }
  }
}

export const paginatedMeta = {
  description: 'Profile (might not be registered)',
  type: 'object',
  properties: {
    has_more: {
      type: 'boolean',
      description: 'For pagination. If there are more results this will be true.'
    },
    next_cursor: {
      type: 'string',
      description: 'For pagination. The cursor to pass when retrieving next page (if any)'
    },
    next_url: {
      type: 'string',
      description: 'For pagination. A convenient full URL to call for the next page of results (if any).'
    }
  }
}

export const profiles = {
  description: 'Profiles',
  type: 'array',
  items: profile
}

export const orderedWithCursorProperties = (orderByOptions: string[]): any => {
  return {
    order_by: {
      type: 'string',
      enum: orderByOptions,
      default: orderByOptions[0]
    },
    order_direction: {
      type: 'string',
      enum: [
        'desc',
        'asc'
      ],
      default: 'desc'
    },
    start_cursor: {
      type: 'string',
      description: 'Used for cursor based pagination. See `meta` in the response for the next page.'
    }
  }
}

export const status = {
  description: 'Status of registry and ecosystem',
  type: 'object',
  properties: {
    registry: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 6492 },
        pending_removal: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 2 },
            challenged: { type: 'number', example: 0 },
            not_challenged: { type: 'number', example: 2 }
          }
        },
        pending_registration: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 453 },
            challenged: { type: 'number', example: 67 },
            not_challenged: { type: 'number', example: 386 }
          }
        },
        registered: { type: 'number', example: 5258 },
        expired: { type: 'number', example: 0 },
        removed: { type: 'number', example: 283 }
      }
    }
  }
}

export default {
  ethAddressProperty,
  profile,
  profiles,
  paginatedMeta,
  orderedWithCursorProperties,
  status
}
