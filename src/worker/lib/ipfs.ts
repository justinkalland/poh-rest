import axios from 'axios'
import axiosRetry from 'axios-retry'
import Bottleneck from 'bottleneck'
import { extname } from 'path'

const IPFS_GATEWAY = process.env.IPFS_GATEWAY === undefined ? '' : process.env.IPFS_GATEWAY

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })
const limitedGet = new Bottleneck({
  minTime: 5,
  maxConcurrent: 50
}).wrap(axios.get)

function uriToHttp (uri: string): string | undefined {
  if (uri === undefined) {
    return undefined
  }

  const position = uri.indexOf('ipfs/')

  if (position !== -1) {
    // the '/' was left off indexOf on purpose - some URIs don't start with it.
    return `${IPFS_GATEWAY}/${uri.slice(position)}`
  }

  if (uri.startsWith('http')) {
    return uri
  }

  return undefined
}

// returns JSON data from IPFS, undefined if 404 or not json
async function fetchJsonData (uri: string): Promise<{[key: string]: any} | undefined> {
  const httpUrl = uriToHttp(uri)

  if (httpUrl === undefined || extname(httpUrl) !== '.json') {
    return undefined
  }

  try {
    const response = await limitedGet(httpUrl)

    if (!(response.data instanceof Object)) {
      return undefined
    }

    return response.data
  } catch (err) {
    if (err?.response?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default {
  uriToHttp,
  fetchJsonData
}
