<style lang="scss" src="@/styles/views/Login.scss" scoped></style>

<template>
  <login-template>
    <template v-slot:header>
      <h1>Login</h1>
    </template>
    <template v-slot:main>
      <login-container
        class="login-main-container"
        @submit="handleLoginContainerSubmit"
        @error="handleLoginContainerError"
        @resetPwd="handleResetPasswordEvent"
        :errorMessage="loginError"
        ref="loginContainerRef"
      />
    </template>
    <template v-slot:footer>
      <input-button
        class="login-footer-button"
        mode="plain"
        type="button"
        @click="handleResetPasswordClick"
      >
        <template v-slot:content>
          <p class="button-content">Reset Password</p>
        </template>
      </input-button>
      <input-button
        class="login-footer-button"
        mode="plain"
        type="button"
        @click="handleRegisterClick"
      >
        <template v-slot:content>
          <p class="button-content">Don't have an account yet?</p>
        </template>
      </input-button>
    </template>
  </login-template>
  <notification
    v-model:model-value="showNotification"
    :value="notificationTitle"
    :mode="notificationType"
  />
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

import LoginTemplate from '@/components/templates/LoginTemplate.vue';
import LoginContainer from '@/components/organisms/LoginContainer.vue';
import InputButton from '@/components/atoms/InputButton.vue';
import Notification from '@/components/atoms/Notification.vue';
import Playbook from '@/playbook/playbook';
// eslint-disable-next-line import/no-cycle
import router from '@/router';

type UserDataType = {
  user: string;
  password: string;
};

export default defineComponent({
  name: 'Login',
  components: {
    LoginTemplate,
    LoginContainer,
    InputButton,
    Notification,
  },
  setup() {
    const notificationType: Ref<'error' | 'success' | 'info'> = ref('info');
    const loginContainerRef = ref();
    const loginError = ref('');
    const notificationTitle = ref('');
    const showNotification = ref(false);
    const notify = (type: 'error' | 'success' | 'info' = 'error') => {
      notificationType.value = type;
      showNotification.value = true;
    };
    const handleLoginContainerSubmit = (event: UserDataType) => {
      loginError.value = '';
      Playbook.play('USER_AUTHENTICATION', {
        username: event.user.split('#')[0],
        userTag: event.user.split('#')[1],
        password: event.password,
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          loginError.value = errorMessage;
          return;
        }
        router.push({ path: '/' });
      });
    };
    const handleLoginContainerError = (msg: string) => {
      notificationTitle.value = msg;
      notify();
    };
    const handleResetPasswordClick = () => {
      loginContainerRef.value.handleResetPassword();
    };
    const handleResetPasswordEvent = (user: string) => {
      Playbook.play('ACCOUNT_RESET_PASSWORD', {
        username: user.split('#')[0],
        userTag: user.split('#')[1],
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          notificationTitle.value = errorMessage;
          notify();
        }
        notificationTitle.value = 'Check your email';
        notify('info');
      });
    };
    const handleRegisterClick = () => {
      router.push({ name: 'Register' });
    };
    return {
      handleLoginContainerSubmit,
      handleLoginContainerError,
      handleResetPasswordClick,
      handleResetPasswordEvent,
      handleRegisterClick,
      showNotification,
      notificationTitle,
      loginError,
      notificationType,
      loginContainerRef,
    };
  },
});
</script>
