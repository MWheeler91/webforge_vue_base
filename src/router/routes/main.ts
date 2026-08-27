import type { RouteRecordRaw } from 'vue-router'
import UnderConstructionView from '@/views/UnderConstructionView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: UnderConstructionView,
  },
  {
    path: '/under-construction',
    name: 'under-construction',
    component: UnderConstructionView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]
