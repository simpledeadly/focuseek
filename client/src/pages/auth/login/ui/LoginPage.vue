<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@/app/router/router'
import { loginUser } from '@/shared/api/api'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

const username = ref('')
const password = ref('')

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const login = async () => {
  try {
    if (username.value.length !== 0 && password.value.length !== 0) {
      const res = await loginUser(username.value, password.value)
      emit('loading', true)
      console.log('Пользователь авторизован!', res)
      console.log('localStorage:', localStorage.getItem('auth'))
      password.value = ''
      router.push({ path: '/inbox' }).then(() => {
        window.location.reload()
      })
    }
  } catch (e: any) {
    alert(e)
  }
}
</script>

<template>
  <div class="login-page">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Jump into Focuseek!</CardDescription>
      </CardHeader>
      <form
        name="loginForm"
        class="form"
        @submit.prevent="login"
      >
        <CardContent>
          <div class="grid w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="Enter username"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter
          class="flex justify-center px-6 pb-6"
          style="flex-direction: column"
        >
          <Button
            type="submit"
            style="width: 100%"
            @click="login"
            >Sign in</Button
          >
          <br />
          <div class="flex">
            <p>Do not have an account?</p>
            <RouterLink
              to="/register"
              class="ml-2"
            >
              <p><strong>Sign up</strong></p>
            </RouterLink>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<style lang="scss">
.login-page {
  /** keep */
}
</style>
