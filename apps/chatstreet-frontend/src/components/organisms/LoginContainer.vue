<style lang="scss" src="@/styles/components/organisms/LoginContainer.scss" scoped></style>

<template>
  <form class="login-container" @submit.prevent="handleFormSubmit">
    <profile-badge class="login-container-profile" />
    <input-field
      class="login-container-user"
      title="Username#Tag"
      :modelValue="userInput"
      @update="setUserInput"
      :valid="formValidationErrors.userInputError"
      mode="sharp"
      type="text"
      required
    />
    <input-field
      class="login-container-password"
      title="Password"
      :modelValue="passwordInput"
      @update="setPasswordInput"
      :valid="formValidationErrors.passwordInputError"
      mode="sharp"
      type="password"
      required
    />
    <p class="login-container-error" :class="loginContainerErrorModifierClass">
      {{ errorMessage }}
    </p>
    <input-button class="login-container-button" mode="confirm" type="submit">
      <template v-slot:content>
        <div class="button-content">
          <spinner v-if="submitIsPending" />
          <span v-else class="icon-arrow-right" />
        </div>
      </template>
    </input-button>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';

import { validUser } from '@/utlis/functions.util';
import InputButton from '../atoms/InputButton.vue';
import InputField from '../molecules/InputField.vue';
import Spinner from '../atoms/Spinner.vue';
import ProfileBadge from '../atoms/ProfileBadge.vue';

export default defineComponent({
  name: 'LoginContainer',
  components: {
    InputButton,
    InputField,
    Spinner,
    ProfileBadge,
  },
  emits: ['submit', 'error', 'resetPwd'],
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const submitIsPending = ref(false);
    const formValidationErrors = ref({
      userInputError: false,
      passwordInputError: false,
    });
    const userInput = ref('');
    const passwordInput = ref('');
    const submitLogin = () => {
      context.emit('submit', {
        user: userInput.value,
        password: passwordInput.value,
      });
    };
    const resetPassword = () => {
      context.emit('resetPwd', userInput.value);
    };
    const submitError = () => {
      context.emit(
        'error',
        formValidationErrors.value.userInputError
          ? 'The password input value is invalid'
          : 'The user input value is invalid',
      );
    };
    const resetPasswordError = () => {
      context.emit('error', 'Please provide a valid user input');
    };
    const loginFormIsValid = () => formValidationErrors.value.userInputError && formValidationErrors.value.passwordInputError;
    const resetPasswordFormIsValid = () => formValidationErrors.value.userInputError;
    const handleFormSubmit = () => {
      if (!loginFormIsValid()) {
        submitError();
        return;
      }
      submitIsPending.value = true;
      submitLogin();
    };
    const handleResetPassword = () => {
      if (!resetPasswordFormIsValid()) {
        resetPasswordError();
        return;
      }
      resetPassword();
    };
    const setUserInput = (value: string) => {
      userInput.value = value;
    };
    const setPasswordInput = (value: string) => {
      passwordInput.value = value;
    };
    const loginContainerErrorModifierClass = computed(
      (): string => `login-container-error--${props.errorMessage.length > 0 ? 'visible' : 'hide'}`,
    );
    watch(userInput, (newValue: string) => {
      formValidationErrors.value.userInputError = validUser(newValue);
    });
    watch(passwordInput, (newValue: string) => {
      formValidationErrors.value.passwordInputError = newValue !== '';
    });
    watch(
      () => props.errorMessage,
      (newErrorMessage: string) => {
        if (newErrorMessage.length > 0) {
          submitIsPending.value = false;
        }
      },
    );
    context.expose({ handleResetPassword });
    return {
      handleFormSubmit,
      setUserInput,
      setPasswordInput,
      userInput,
      passwordInput,
      formValidationErrors,
      loginContainerErrorModifierClass,
      submitIsPending,
    };
  },
});
</script>
