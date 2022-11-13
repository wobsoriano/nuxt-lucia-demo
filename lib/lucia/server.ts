import type { H3Event } from 'h3'
import { appendHeader, createError, defineEventHandler, getRouterParams, isMethod } from 'h3'
import type { Auth, Session, User } from 'lucia-auth'
import { convertH3EventRequestToStandardRequest } from './request'

export function defineAuthHandler(auth: Auth) {
  return defineEventHandler(async (event) => {
    const params = getRouterParams(event)
    const action = params._.split('/')[0] as 'user' | 'logout'

    if (action === 'user' && isMethod(event, 'GET')) {
      const { user } = await getSessionUser(event, auth)
      return { user }
    }

    if (action === 'logout' && isMethod(event, 'POST')) {
      const sessionId = auth.validateRequestHeaders(convertH3EventRequestToStandardRequest(event, auth))
      if (!sessionId)
        return {}
      try {
        await auth.invalidateSession(sessionId)
        setSession(event, auth, null)
        return {}
      }
      catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Unknown error',
        })
      }
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  })
}

export function setSession(event: H3Event, auth: Auth, session: Session | null) {
  const cookies = auth.createSessionCookies(session).map(cookie => cookie.serialize()).toString()
  for (const cookie of cookies.split(','))
    appendHeader(event, 'set-cookie', cookie)
}

export async function getSession(event: H3Event, auth: Auth): Promise<{
  user: User
  session: Session
} | null> {
  try {
    const sessionId = await auth.validateRequestHeaders(convertH3EventRequestToStandardRequest(event, auth))
    const session = await auth.validateSessionUser(sessionId, (session: Session | null) => {
      setSession(event, auth, session)
    })
    return session
  }
  catch (e) {
    return null
  }
}

export async function getSessionUser(event: H3Event, auth: Auth): Promise<
| { user: User; session: Session }
| {
  user: null
  session: null
}
> {
  try {
    const sessionId = await auth.validateRequestHeaders(convertH3EventRequestToStandardRequest(event, auth))
    const session = await auth.validateSessionUser(sessionId, (session: Session | null) => {
      setSession(event, auth, session)
    })

    return session
  }
  catch {
    return {
      session: null,
      user: null,
    }
  }
}
