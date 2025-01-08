import { authenticationGuard } from '@/guards/authenticationGuard'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: "/login",
          name: "login",
          component: () => import('@/views/LoginView.vue')
        },
        {
          path: "/home",
          name: "home",
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: "/signin",
          name: "signin",
          component: () => import('@/views/RegisterView.vue')
        }
      ]
    },
  ],
})

export default router
