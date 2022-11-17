import type { Auth, MinimalRequest } from 'lucia-auth'
import type { H3Event } from 'h3'
import { getHeader, getMethod } from 'h3'
import getReqURL from 'requrl'

function getURL(event: H3Event, env: string) {
  const host = getHeader(event, 'host')

  if (env === 'DEV')
    return `http://${host}${event.node.req.url}`

  return getReqURL(event.node.req)
}

export function convertH3EventRequestToStandardRequest(
  event: H3Event,
  auth: Auth,
): MinimalRequest {
  const url = getURL(event, auth.configs.env)

  return {
    headers: {
      get: (name: string) => {
        const value = event.node.req.headers[name.toLocaleLowerCase()] || null
        if (Array.isArray(value))
          return value.toString()
        return value
      },
    },
    url,
    method: getMethod(event),
  }
}
