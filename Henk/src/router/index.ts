import { createRouter, createWebHistory } from 'vue-router'

import GroupList from '../components/GroupList.vue'
import GroupInvites from '../components/GroupInvites.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: GroupList,
  },
  {
    path: '/invites',
    name: 'invites',
    component: GroupInvites,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

