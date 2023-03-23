import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Test from '../views/Test.vue';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/:_(.*)*',
    redirect: '/',
  },
];

if (process.env.NODE_ENV === 'development') {
  console.log(
    'dev',
  );
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
