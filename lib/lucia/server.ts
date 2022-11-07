import type { H3Event } from 'h3'
import type { Auth, Session } from 'lucia-auth'
import { appendHeader, defineEventHandler, isMethod } from 'h3'
import { convertH3EventRequestToStandardRequest } from './request'

export function defineAuthHandler(auth: Auth) {
  return defineEventHandler(async (event) => {
    const action = event.context.params._.split('/')[0] as 'user' | 'logout'

    if (action === 'user' && isMethod(event, 'GET')) {
      try {
        const { user } = await getSessionUser(event, auth)
        return { user }
      }
      catch {
        return { user: null }
      }
    }

    if (action === 'logout' && isMethod(event, 'POST')) {
      const sessionId = auth.parseRequest(convertH3EventRequestToStandardRequest(event, auth))
      if (!sessionId)
        return {}
      try {
        await auth.invalidateSession(sessionId)
        await setSession(event, auth, null)
        return {}
      }
      catch {
        throw createError({
          statusCode: 500,
          statusMessage: 'Unknown error',
        })
      }
    }

    event.res.statusCode = 404
    return 'Not Found'
  })
}

export async function setSession(event: H3Event, auth: Auth, session: Session | null) {
  const cookies = auth.createSessionCookies(session).map(cookie => cookie.serialize()).toString()
  for (const cookie of cookies.split(','))
    appendHeader(event, 'set-cookie', cookie)
}

export async function getSession(event: H3Event, auth: Auth) {
  try {
    const session = await auth.validateRequest(
      convertH3EventRequestToStandardRequest(event, auth),
      (session: Session | null) => {
        setSession(event, auth, session)
      },
    )
    return session
  }
  catch (e) {
    return null
  }
}

export async function getSessionUser(event: H3Event, auth: Auth) {
  try {
    const data = await auth.getSessionUserFromRequest(
      convertH3EventRequestToStandardRequest(event, auth),
      (session: Session | null) => {
        setSession(event, auth, session)
      },
    )

    return data
  }
  catch {
    return {
      session: null,
      user: null,
    }
  }
}
