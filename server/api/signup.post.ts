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
      user,
      session,
    }
  }
  catch (e) {
    const error = e as Error

    if (error.message === 'AUTH_DUPLICATE_PROVIDER_ID') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username already in use',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Unknown error',
    })
  }
})
