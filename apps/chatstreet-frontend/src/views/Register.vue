<style lang="scss" src="@/styles/views/Register.scss" scoped></style>

<template>
  <register-template>
    <template v-slot:header>
      <h1>Register</h1>
    </template>
    <template v-slot:main>
      <register-container
        class="register-main-container"
        :errorMessage="registerError"
        :requestStatus="registerRequestState?.status"
        @submit="handleRegisterContainerSubmit"
        @error="handleRegisterContainerError"
      />
    </template>
    <template v-slot:footer>
      <input-button
        class="register-footer-button"
        mode="plain"
        type="button"
        @click="handleLoginClick"
      >
        <template v-slot:content>
          <div class="button-content">
            <p>Proceed to Login?</p>
          </div>
        </template>
      </input-button>
      <p class="register-footer-caption">
        Welcome to Chatstreet! All of your messages are End2End encrypted.
      </p>
    </template>
  </register-template>
  <notification
    v-model:model-value="showNotification"
    :value="notificationTitle"
    :mode="notificationType"
  />
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, computed,
} from 'vue';
import { RegisterUserRequestType } from '@/services/types/request.type';
import RegisterTemplate from '@/components/templates/RegisterTemplate.vue';
import RegisterContainer from '@/components/organisms/RegisterContainer.vue';
import Notification from '@/components/atoms/Notification.vue';
import InputButton from '@/components/atoms/InputButton.vue';
import Playbook from '@/playbook/playbook';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import store from '@/store';

export default defineComponent({
  name: 'Register',
  components: {
    RegisterTemplate,
    RegisterContainer,
    Notification,
    InputButton,
  },
  setup() {
    const showNotification: Ref<boolean> = ref(false);
    const notificationTitle: Ref<string> = ref('');
    const registerError: Ref<string> = ref('');
    const notificationType: Ref<'error' | 'success' | 'info'> = ref('info');
    const registerRequestState = computed(() => store.getters['account/getRegisterUserRequest']);
    const notify = (type: 'error' | 'success' | 'info' = 'error') => {
      notificationType.value = type;
      showNotification.value = true;
    };
    const handleLoginClick = () => {
      router.push({ name: 'Login' });
    };
    const handleRegisterContainerError = (msg: string) => {
      notificationTitle.value = msg;
      notify();
    };
    const handleRegisterContainerSubmit = (data: RegisterUserRequestType) => {
      registerError.value = '';
      Playbook.play('USER_REGISTRATION', data).then((errorMessage: string | null) => {
        if (errorMessage) {
          registerError.value = errorMessage;
          return;
        }
        notificationTitle.value = 'Check your email';
        notify('info');
      });
    };
    return {
      handleRegisterContainerSubmit,
      handleRegisterContainerError,
      handleLoginClick,
      registerRequestState,
      registerError,
      showNotification,
      notificationTitle,
      notificationType,
    };
  },
});
</script>
