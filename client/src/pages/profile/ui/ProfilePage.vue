<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { UserCircle } from 'lucide-vue-next'
import DialogClose from '@/shared/ui/dialog/DialogClose.vue'
import { useAuth } from '@/app/useAuth'

const { getUserId } = useAuth()
</script>

<template>
  <div class="profile-page">
    <Dialog>
      <DialogTrigger as-child>
        <UserCircle
          :size="18"
          class="app__icons_profile-icon icon"
        />
      </DialogTrigger>
      <DialogContent class="sm:min-w-[90vw] sm:min-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Your profile</DialogDescription>
        </DialogHeader>
        <div>
          userId: <strong>{{ getUserId }}</strong>
        </div>
        <DialogFooter class="profile-page__footer">
          <DialogClose as-child>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style lang="scss">
* {
  outline: none;
}

.profile-page {
  &__footer {
    display: flex;
    align-items: end;
  }
}
</style>
