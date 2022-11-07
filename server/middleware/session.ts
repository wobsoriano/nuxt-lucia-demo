import type { Session } from 'lucia-auth'
import { auth } from '../api/auth/[...]'
import { getSessionUser } from '~~/lib/lucia/server'

export default defineEventHandler(async (event) => {
  const { user, session } = await getSessionUser(event, auth)
  event.context.user = user
  event.context.session = session
})

declare module 'h3' {
  interface H3EventContext {
    user: {
      userId: string
      username: string
    } | null
    session: Session | null
  }
}
