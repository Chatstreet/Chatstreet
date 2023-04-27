<style lang="scss">
@import '@/styles/_global.scss';
@import '@/styles/_typographie.scss';
@import '@/styles/_icon-font.scss';
</style>

<template>
  <router-view />
</template>

<script lang="ts">
import {
  defineComponent, onMounted, computed, watch,
} from 'vue';
import Playbook from '@/playbook/playbook';
import { useRoute } from 'vue-router';
import router from './router';

export default defineComponent({
  name: 'App',
  setup() {
    const route = computed(() => useRoute());
    const isExcludedRouteName = (routeName: string) => {
      const excludedRouteNames: string[] = [
        'EmailVerification',
        'ResetPassword',
        'Test',
        'Register',
      ];
      return excludedRouteNames.includes(routeName);
    };
    const checkLoginState = (routeName: string) => {
      if (isExcludedRouteName(routeName)) return;
      Playbook.play('VALIDATE_USER_AUTHENTICATION_STATE').then(
        (isAuthenticated: boolean | null) => {
          if (!isAuthenticated) {
            router.push({ name: 'Login' });
          } else if (routeName === 'Login') {
            router.push({ name: 'Home' });
          }
        },
      );
    };
    onMounted(() => {
      if (!route.value.name) return;
      checkLoginState(route.value.name.toString());
    });
    watch(
      () => route.value.name,
      (newRouteName) => {
        if (!newRouteName) return;
        checkLoginState(newRouteName.toString());
      },
    );
    return {};
  },
});
</script>
