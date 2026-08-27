import { describe, expect, it } from 'vitest'
import UnderConstructionView from '@/views/UnderConstructionView.vue'
import { mainRoutes } from './main'

describe('main routes', () => {
  it('renders the scaffold page at the home route', () => {
    const homeRoute = mainRoutes.find((route) => route.name === 'Home')

    expect(homeRoute?.path).toBe('/')
    expect(homeRoute?.component).toBe(UnderConstructionView)
  })

  it('keeps the under-construction page available as a separate route', () => {
    const constructionRoute = mainRoutes.find((route) => route.name === 'under-construction')

    expect(constructionRoute?.path).toBe('/under-construction')
    expect(constructionRoute?.component).toBe(UnderConstructionView)
  })
})
