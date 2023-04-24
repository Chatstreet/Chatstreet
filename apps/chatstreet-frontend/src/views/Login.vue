<style lang="scss" src="@/styles/views/Login.scss" scoped></style>

<template>
  <login-template>
    <template v-slot:header>
      <h1>Login</h1>
    </template>
    <template v-slot:main>
      <login-container class="login-main-container" @submit="handleLoginContainerSubmit" />
    </template>
    <template v-slot:footer>
      <input-button
        class="login-main-button"
        mode="plain"
        type="button"
        @click="handleResetPasswordClick"
      >
        <template v-slot:content>
          <p class="button-content">Reset Password</p>
        </template>
      </input-button>
    </template>
  </login-template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoginTemplate from '@/components/templates/LoginTemplate.vue';
import LoginContainer from '@/components/organisms/LoginContainer.vue';
import InputButton from '@/components/atoms/InputButton.vue';
import Playbook from '@/playbook/playbook';
// eslint-disable-next-line import/no-cycle
import router from '@/router';

type UserDataType = {
  user: string;
  password: string;
};

export default defineComponent({
  name: 'Login',
  components: { LoginTemplate, LoginContainer, InputButton },
  setup() {
    // TODO: Add Event Type
    const handleLoginContainerSubmit = (event: UserDataType) => {
      Playbook.play('USER_AUTHENTICATION', {
        username: event.user.split('#')[0],
        userTag: event.user.split('#')[1],
        password: event.password,
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          // TODO: Display Errors
          return;
        }
        router.push({ path: '/' });
      });
    };
    const handleResetPasswordClick = () => {
      // TODO: Implement
      console.log('reset password');
    };
    return {
      handleLoginContainerSubmit,
      handleResetPasswordClick,
    };
  },
});
</script>
