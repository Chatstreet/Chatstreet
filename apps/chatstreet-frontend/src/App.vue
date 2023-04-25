<style lang="scss">
@import '@/styles/_global.scss';
@import '@/styles/_typographie.scss';
@import '@/styles/_icon-font.scss';
</style>

<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import Playbook from '@/playbook/playbook';
import { useRoute } from 'vue-router';
import router from './router';

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute();
    onMounted(() => {
      if (route.name === 'EmailVerification' || route.name === 'ResetPassword') return;
      Playbook.play('VALIDATE_USER_AUTHENTICATION_STATE').then(
        (isAuthenticated: boolean | null) => {
          if (!isAuthenticated) {
            router.push({ name: 'Login' });
          } else if (route.name === 'Login') {
            router.push({ path: '/' });
          }
        },
      );
    });
    return {};
  },
});
</script>
