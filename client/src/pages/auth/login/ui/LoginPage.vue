<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@/app/router'
import { loginUser } from '@/shared/api/api'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from 'radix-vue'

const username = ref('')
const password = ref('')

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const login = async () => {
  try {
    const res = await loginUser(username.value, password.value)
    emit('loading', true)
    console.log('Пользователь авторизован!', res)
    console.log('localStorage:', localStorage.getItem('auth'))
    router.push({ name: 'todo' }).then(() => { window.location.reload() })
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
      <CardContent>
        <form @submit.prevent="login" class="form">
          <div class="grid w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="username">Username</Label>
              <Input v-model="username" type="text" id="username" required />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input v-model="password" type="password" id="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center px-6 pb-6" style="flex-direction: column;">
        <Button type="submit" @click="login">Sign in</Button>
        <br>
        <div class="flex">
          <p>Does not have an account?</p>
          <RouterLink to="/register" class="ml-2">
            <p><strong>Sign up</strong></p>
          </RouterLink>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<style lang="scss">
.login-page {
  margin: auto 0;
  height: 85vh;
}
</style>
