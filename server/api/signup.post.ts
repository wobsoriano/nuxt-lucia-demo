import { setSession } from '@/lib/lucia/server'
import { auth } from '@/server/api/auth/[...]'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username: string; password: string }>(event)

  if (!username || !password) {
    event.res.statusCode = 400
    event.res.statusMessage = 'Username and password is invalid'
  }

  try {
    const user = await auth.createUser('username', username, {
      password,
      attributes: {
        username,
      },
    })
    const session = await auth.createSession(user.userId)
    setSession(event, auth, session)

    event.res.statusCode = 201
    return {
      userId: session.userId,
    }
  }
  catch (e) {
    const error = e as Error

    if (error.message === 'AUTH_DUPLICATE_PROVIDER_ID') {
      event.res.statusCode = 400
      event.res.statusMessage = 'Username already in use'
    }

    throw createError({
      statusCode: 500,
      message: 'Unknown error',
    })
  }
})
