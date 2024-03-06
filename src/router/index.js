

import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/Home.vue';
import Buscador from '@/components/Buscador.vue';
import Watchlist from '@/components/Watchlist.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import actor from '@/components/actor.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/buscador',
      name: 'buscador',
      component: Buscador
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: Watchlist
    },
    {
      path: '/product/:id?',
      name: 'product',
      component: ProductDetail
    }  ,  {
      path: '/actor',
      name: 'actor',
      component: actor
    },
  ]
})


export default router;
