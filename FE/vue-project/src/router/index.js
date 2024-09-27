import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Chats from '../views/Chats.vue'
import Sample from '../views/Sample.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chats',
      name: 'chats',
      component: Chats
    },
    {
      path: '/:pathMatch(.*)*',  // Catch all undefined routes
      name: 'sample',
      component: Sample
    }
   
  ]
})

export default router
