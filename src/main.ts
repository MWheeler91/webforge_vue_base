import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { configureApiClient } from '@mwheeler91/site-core'

import App from './App.vue'
import router from './router/index.ts'

import './style.css'

configureApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  siteKey: import.meta.env.VITE_SITE_KEY,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Wait for the initial route before mounting the application.
router.isReady().then(() => {
  app.mount('#app')
})
