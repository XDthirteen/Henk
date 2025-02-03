import { authenticationGuard } from '@/guards/authenticationGuard'
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
          path: "/home",
          name: "home",
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/HomeView.vue')
        },

        {
          path: "/groups",
          name: "groups",
          beforeEnter: [authenticationGuard],
          component: () => import('@/components/GroupList.vue')
        },

        {
          path: "/invites",
          name: "invites",
          beforeEnter: [authenticationGuard],
          component: () => import('@/components/GroupInvites.vue')
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
        },
      ]
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
    },
  ],
})

export default router
