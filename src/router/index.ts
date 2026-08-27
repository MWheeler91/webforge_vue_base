import { createRouter, createWebHistory } from 'vue-router'
import { mainRoutes } from '@/router/routes/main'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...mainRoutes],
  scrollBehavior(to, from, savedPosition) {
    // 1) If browser provides a saved position (back/forward), use it
    if (savedPosition) return savedPosition;

    // 2) If there’s a hash, scroll to it
    if (to.hash) return { el: to.hash };

    // 3) Ensure /account always starts at top
    if (to.path.startsWith("/account")) return { top: 0, behavior: "smooth" };

    // 4) Default—top
    return { top: 0 };
  },
})

export default router
