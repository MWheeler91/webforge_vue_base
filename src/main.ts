import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.ts'

import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Wait for the initial route before mounting the application.
router.isReady().then(() => {
  app.mount('#app')
})
