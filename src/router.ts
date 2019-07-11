import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Orden from './views/Orden.vue';
import Pedidos from './views/Pedidos.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: Pedidos,
    },
    {
      path: '/orden',
      name: 'orden',
      component: Orden,
    },
  ],
});
