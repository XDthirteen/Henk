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
      ]
    },
  ],
})

export default router
