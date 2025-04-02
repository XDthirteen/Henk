import { authenticationGuard } from '@/guards/authenticationGuard'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'welcome',
      component: () => import('@/layouts/WelcomeLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: '/signup',
          name: 'signup',
          component: () => import('@/views/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/main',
      beforeEnter: [authenticationGuard],
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/HomeView.vue'),
        },

        {
          path: '/groups',
          name: 'groups',
          beforeEnter: [authenticationGuard],
          component: () => import('@/components/GroupList.vue'),
        },

        {
          path: '/createGroup',
          name: 'createGroup',
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/CreateGroup.vue'),
        },

        {
          path: '/invites',
          name: 'invites',
          beforeEnter: [authenticationGuard],
          component: () => import('@/components/GroupInvites.vue'),
        },
        {
          path: '/weather',
          name: 'weather',
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/WeatherView.vue'),
        },
        {
          path: '/myAccount',
          name: 'myAccount',
          beforeEnter: [authenticationGuard],
          component: () => import('@/layouts/MyAccount.vue'),
          children: [
            {
              path: '/myAccount/settings',
              name: 'settings',
              beforeEnter: [authenticationGuard],
              component: () => import('@/views/AccountUserSettings.vue'),
            },
            {
              path: '/myAccount/parameters',
              name: 'parameters',
              beforeEnter: [authenticationGuard],
              component: () => import('@/views/AccountParameters.vue'),
            },
          ],
        },
        {
          path: '/calendar',
          name: 'calendar',
          beforeEnter: [authenticationGuard],
          component: () => import('@/views/CalendarView.vue'),
        },
        {
          path: '/calendar/events',
          name: 'calenderEvents',
          component: () => import('@/views/CalendarEventView.vue'),
        },
        {
          path: '/tasks',
          name: 'tasks',
          beforeEnter: [authenticationGuard],
          component: () => import('@/layouts/TasksView.vue'),
          children: [
            {
              path: '/tasks/todo',
              name: 'todo_tasks',
              beforeEnter: [authenticationGuard],
              component: () => import('@/views/TasksToDoView.vue'),
            },
            {
              path: '/tasks/done',
              name: 'done_tasks',
              beforeEnter: [authenticationGuard],
              component: () => import('@/views/TasksDoneView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
