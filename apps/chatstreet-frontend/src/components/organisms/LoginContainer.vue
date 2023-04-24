<style lang="scss" src="@/styles/components/organisms/LoginContainer.scss" scoped></style>

<template>
  <form class="login-container" @submit.prevent="handleFormSubmit">
    <div class="login-container-profile">
      <span class="icon-profile" />
    </div>
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
    <input-button class="login-container-button" mode="confirm" type="submit">
      <template v-slot:content>
        <div class="button-content">
          <span class="icon-arrow-right" />
        </div>
      </template>
    </input-button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import { validUser } from '@/utlis/functions.util';
import InputButton from '../atoms/InputButton.vue';
import InputField from '../molecules/InputField.vue';

export default defineComponent({
  name: 'LoginContainer',
  components: { InputButton, InputField },
  emits: ['submit', 'error'],
  setup(_, context) {
    const formValidationErrors = ref({
      userInputError: true,
      passwordInputError: true,
    });
    const userInput = ref('');
    const passwordInput = ref('');
    const submit = () => {
      context.emit('submit', {
        user: userInput.value,
        password: passwordInput.value,
      });
    };
    const error = () => {
      context.emit(
        'error',
        formValidationErrors.value.userInputError
          ? 'The user input value is invalid'
          : 'The password input value is invalid',
      );
    };
    const formIsValid = () => !formValidationErrors.value.userInputError && !formValidationErrors.value.passwordInputError;
    const handleFormSubmit = () => {
      if (!formIsValid()) {
        error();
        return;
      }
      submit();
    };
    const setUserInput = (value: string) => {
      userInput.value = value;
    };
    const setPasswordInput = (value: string) => {
      passwordInput.value = value;
    };
    watch(userInput, (newValue: string) => {
      formValidationErrors.value.userInputError = !validUser(newValue);
    });
    watch(passwordInput, (newValue: string) => {
      formValidationErrors.value.passwordInputError = newValue === '';
    });
    return {
      handleFormSubmit,
      setUserInput,
      setPasswordInput,
      userInput,
      passwordInput,
      formValidationErrors,
    };
  },
});
</script>
