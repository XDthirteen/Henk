import { authenticationGuard } from '@/guards/authenticationGuard'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
        name: "welcome",
        component: () => import('@/layouts/WelcomeLayout.vue'),
        children: [
          {
            path: "/login",
            name: "login",
            component: () => import('@/views/LoginView.vue')
          },
          {
            path: "/signup",
            name: "signup",
            component: () => import('@/views/RegisterView.vue')
          }
        ]
    },
    {
      path: "/main",
      beforeEnter: [authenticationGuard],
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
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
        },
        {
          path: "/weather",
          name: "weather",
          component: () => import('@/views/WeatherView.vue')
        },
        {
          path: "/myAccount",
          name: "myAccount",
          beforeEnter: [authenticationGuard],
          component: () => import('@/layouts/MyAccount.vue'),
          children: [
            {
              path: "/myAccount/settings",
              name: "settings",
              component: () => import('@/views/AccountUserSettings.vue')
            },
            {
              path: "/myAccount/parameters",
              name: "parameters",
              component: () => import('@/views/AccountParameters.vue')
            }
          ]
        }
      ]
    }
  ],
})

export default router
