import lucia from 'lucia-auth'
import supabase from '@lucia-auth/adapter-supabase'

// Why export a function?
// https://v3.nuxtjs.org/migration/runtime-config#runtime-config
export function getAuth() {
  const config = useRuntimeConfig()
  const auth = lucia({
    env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    adapter: supabase(config.supabaseUrl, config.supabaseSecret),
    transformUserData: (userData) => {
      return {
        userId: userData.id,
        username: userData.username,
      }
    },
  })

  return auth
}

export type Auth = ReturnType<typeof getAuth>
