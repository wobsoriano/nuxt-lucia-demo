<script setup lang="ts">
const username = ref('')
const password = ref('')
const user = useUser()

type FetchError = Error & {
  statusCode: number
  statusMessage: string
  data: {
    message: string
  }
}

const { error, data, execute } = useAsyncData(() => $fetch('/api/login', {
  method: 'POST',
  body: {
    username: username.value,
    password: password.value,
  },
}), {
  server: false,
  immediate: false,
})

async function handleSubmit() {
  try {
    await execute()
    user.value = data.value!.user
    navigateTo('/')
  }
  catch {}
}

const errorMessage = computed(() => (error.value as FetchError)?.data?.message ?? '')

definePageMeta({
  middleware: 'public',
})
</script>

<template>
  <div>
    <h2>Sign in</h2>
    <form method="post" action="/api/login" @submit.prevent="handleSubmit">
      <label htmlFor="username">username</label>
      <br>
      <input v-model="username" name="username">
      <br>
      <label htmlFors="password">password</label>
      <br>
      <input v-model="password" type="password" name="password">
      <br>
      <button type="submit" class="button">
        Continue
      </button>
    </form>
    <p v-if="error" class="error">
      {{ errorMessage }}
    </p>
    <NuxtLink to="/signup">
      Sign up
    </NuxtLink>
  </div>
</template>
