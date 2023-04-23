import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Settings from '@/views/Settings.vue';
import Chat from '@/views/Chat.vue';
import EmailVerification from '@/views/EmailVerification.vue';
import ResetPassword from '@/views/ResetPassword.vue';

import Test from '@/views/Test.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/chat/:user',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/email-verification/:code',
    name: 'EmailVerification',
    component: EmailVerification,
  },
  {
    path: '/reset-password/:code',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/:_(.*)*',
    redirect: '/',
  },
];

if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: '/test',
    name: 'Test',
    component: Test,
  });
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
