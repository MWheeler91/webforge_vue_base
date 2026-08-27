import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@/App.vue'
import { useSiteStore } from '@/stores/site.store'

describe('App', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<main>Test page</main>' } }],
  })

  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  it('mounts with the application plugins', () => {
    const pinia = createPinia()
    const siteStore = useSiteStore(pinia)
    const init = vi.spyOn(siteStore, 'init').mockResolvedValue()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(init).toHaveBeenCalledOnce()
    expect(wrapper.find('.min-h-screen').exists()).toBe(true)
  })
})
