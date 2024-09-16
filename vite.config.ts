import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import stylelint from 'vite-plugin-stylelint'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    stylelint({
      fix: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/shared/styles/base.scss';`,
      },
    },
  },
})
