<style lang="scss" src="@/styles/components/organisms/ChangePasswordContainer.scss" scoped></style>

<template>
  <form class="change-password-container" @submit.prevent="handleFormSubmit">
    <h2 class="change-password-container-title">Change Your Password</h2>
    <input-field
      class="change-password-container-input"
      title="Password"
      :modelValue="passwordInput"
      @update="setPasswordInput"
      :valid="!hasPasswordInputError"
      type="password"
      required
    />
    <input-field
      class="change-password-container-input"
      title="Repeat Password"
      :modelValue="passwordConfirmationInput"
      @update="setPasswordConfirmationInput"
      :valid="!isPasswordInputError"
      type="password"
      required
    />
    <p class="change-password-container-error" :class="changePasswordErrorClassModifier">
      The passwords don't match...
    </p>
    <input-button class="change-password-container-button" mode="confirm" type="submit">
      <template v-slot:content>
        <span class="button-content icon-arrow-right" />
      </template>
    </input-button>
  </form>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, computed,
} from 'vue';
import InputField from '../molecules/InputField.vue';
import InputButton from '../atoms/InputButton.vue';

export default defineComponent({
  name: 'ChangePasswordContainer',
  components: { InputField, InputButton },
  emits: ['submit'],
  setup(_, context) {
    const displayError: Ref<boolean> = ref(false);
    const passwordInput: Ref<string> = ref('');
    const passwordConfirmationInput: Ref<string> = ref('');
    const submitForm = () => {
      context.emit('submit', passwordInput.value);
    };
    const setPasswordInput = (newValue: string) => {
      passwordInput.value = newValue;
    };
    const setPasswordConfirmationInput = (newValue: string) => {
      passwordConfirmationInput.value = newValue;
    };
    const hasPasswordInputError = computed(() => passwordInput.value.length === 0);
    const isPasswordInputError = computed(
      () => passwordInput.value !== passwordConfirmationInput.value,
    );
    const handleFormSubmit = () => {
      if (isPasswordInputError.value || hasPasswordInputError.value) {
        displayError.value = true;
        return;
      }
      submitForm();
    };
    const changePasswordErrorClassModifier = computed(
      () => `change-password-container-error--${displayError.value ? 'visible' : 'hidden'}`,
    );
    return {
      handleFormSubmit,
      setPasswordInput,
      setPasswordConfirmationInput,
      hasPasswordInputError,
      isPasswordInputError,
      passwordInput,
      passwordConfirmationInput,
      changePasswordErrorClassModifier,
    };
  },
});
</script>
