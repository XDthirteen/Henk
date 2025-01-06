import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: '/signin',
          name: 'signin',
          component: () => import('@/views/RegisterView.vue'),
        },
        {
          path: '/calendar',
          name: 'calendar',
          // lazy-loaded when the route is visited.
          component: () => import('../views/CalendarView.vue'),
        },
      ],
    },
  ],
})

export default router
