import { setSession } from '@/lib/lucia/server'
import { auth } from '@/server/api/auth/[...]'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username: string; password: string }>(event)

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username and password is invalid',
    })
  }

  try {
    const user = await auth.authenticateUser('username', username, password)
    const session = await auth.createSession(user.userId)
    await setSession(event, auth, session)

    event.res.statusCode = 201
    return {
      session,
      user,
    }
  }
  catch (e) {
    const error = e as Error

    if (error.message === 'AUTH_INVALID_PROVIDER_ID' || error.message === 'AUTH_INVALID_PASSWORD') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password is incorrect',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Unknown error',
    })
  }
})
