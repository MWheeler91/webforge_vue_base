import { defineStore } from 'pinia'
import { ref } from 'vue'

/** The server is the source of truth; Vue only renders the generic fallback. */
export const useMaintenanceStore = defineStore('maintenance', () => {
  const active = ref(false)
  const message = ref('')

  function show(nextMessage = '') {
    active.value = true
    message.value = nextMessage.trim()
  }

  function clear() {
    active.value = false
    message.value = ''
  }

  return { active, message, show, clear }
})
