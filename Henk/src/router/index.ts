import { createRouter, createWebHistory } from 'vue-router'
// import GroupList from '../../group-invites-app/src/components/GroupList.vue'
// import GroupInvites from '../../group-invites-app/src/components/GroupInvites.vue'

import GroupList from '../components/GroupList.vue'
import GroupInvites from '../components/GroupInvites.vue'
const routes = [
  { path: '/', component: GroupList },
  { path: '/invites', component: GroupInvites },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
