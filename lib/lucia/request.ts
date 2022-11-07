import type { Auth, MinimalRequest } from 'lucia-auth'
import type { H3Event } from 'h3'
import { getMethod } from 'h3'

export function convertH3EventRequestToStandardRequest(
  event: H3Event,
  auth: Auth,
): MinimalRequest {
  const url = `${auth.configs.env === 'DEV' ? 'http' : 'https'}://localhost:3000${event.req.url}`

  return {
    headers: {
      get: (name: string) => {
        const value = event.req.headers[name.toLocaleLowerCase()] || null
        if (Array.isArray(value))
          return value.toString()
        return value
      },
    },
    url,
    method: getMethod(event),
  }
}
