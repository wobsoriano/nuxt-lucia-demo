<script setup lang="ts">
import { getUser } from '~~/lib/lucia/client'

const username = ref('')
const password = ref('')
const user = useUser()

async function handleSubmit() {
  try {
    const x = await $fetch('/api/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      },
    })
    user.value = x
    navigateTo({ path: '/' })
  }
  catch (error) {
    console.log(error)
  }
}

definePageMeta({
  middleware: 'public',
})
</script>

<template>
  <div>
    <h1>Login</h1>
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
  </div>
</template>
