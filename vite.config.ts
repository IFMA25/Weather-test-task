import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';


export default defineConfig({
  base: '/Weather-test-task/',
  plugins: [
    vue(),
    VueI18nPlugin({
        include: fileURLToPath(new URL('./src/shared/i18n/locales/**\/*.json', import.meta.url)),
        runtimeOnly: false,
    }),
  
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})