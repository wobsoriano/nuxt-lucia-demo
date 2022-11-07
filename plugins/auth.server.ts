import useUser from '@/composables/useUser'

export default defineNuxtPlugin((nuxtApp) => {
  const user = useUser()
  user.value = nuxtApp.ssrContext?.event.context.user ?? null
})
