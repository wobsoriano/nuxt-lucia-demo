import useUser from '@/composables/useUser'
import { getSessionUser } from '@/lib/lucia/server'
import { getAuth } from '@/lib/lucia'

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useUser()
  const auth = getAuth()

  if (process.server) {
    try {
      const result = await getSessionUser(nuxtApp.ssrContext!.event, auth)
      if (result.user)
        user.value = result.session
    }
    catch {}
  }
})
