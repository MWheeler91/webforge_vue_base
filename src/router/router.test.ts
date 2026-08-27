import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { mainRoutes } from './routes/main'

function makeRouter() {
  return createRouter({ history: createMemoryHistory(), routes: mainRoutes })
}

describe('application routing', () => {
  it('renders the not-found route for unknown paths', async () => {
    const router = makeRouter()

    await router.push('/does-not-exist')

    expect(router.currentRoute.value.name).toBe('not-found')
    expect(router.currentRoute.value.params.pathMatch).toEqual(['does-not-exist'])
  })
})
