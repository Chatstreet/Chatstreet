<style lang="scss" src="@/styles/components/organisms/RegisterContainer.scss" scoped></style>

<template>
  <form class="register-container" @submit.prevent="handleFormSubmit">
    <profile-badge class="register-container-profile" />
    <input-field
      class="register-container-first-name"
      title="First Name"
      :modelValue="firstNameInput"
      @update="setFirstNameInput"
      :valid="formValidationErrors.firstNameInput.valid()"
      mode="sharp"
      type="text"
      required
    />
    <input-field
      class="register-container-last-name"
      title="Last Name"
      :modelValue="lastNameInput"
      @update="setLastNameInput"
      :valid="formValidationErrors.lastNameInput.valid()"
      mode="sharp"
      type="text"
      required
    />
    <input-field
      class="register-container-username"
      title="Username"
      :modelValue="usernameInput"
      @update="setUsernameInput"
      :valid="formValidationErrors.usernameInput.valid()"
      mode="sharp"
      type="text"
      required
    />
    <input-field
      class="register-container-email"
      title="Email Address"
      :modelValue="emailInput"
      @update="setEmailInput"
      :valid="formValidationErrors.emailInput.valid()"
      mode="sharp"
      type="text"
      required
    />
    <input-field
      class="register-container-password"
      title="Password"
      :modelValue="passwordInput"
      @update="setPasswordInput"
      :valid="formValidationErrors.passwordInput.valid()"
      mode="sharp"
      type="password"
      required
    />
    <input-field
      class="register-container-confirm-password"
      title="Repeat Password"
      :modelValue="confirmPasswordInput"
      @update="setConfirmPasswordInput"
      :valid="formValidationErrors.confirmPasswordInput.valid()"
      mode="sharp"
      type="password"
      required
    />
    <p class="register-container-error" :class="registerFormErrorClassModifier">
      {{ errorMessage }}
    </p>
    <input-button class="register-container-button" mode="confirm" type="submit">
      <template v-slot:content>
        <div class="button-content">
          <spinner v-if="isLoading" />
          <span v-else class="icon-arrow-right" />
        </div>
      </template>
    </input-button>
  </form>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, computed, watch, PropType,
} from 'vue';
import { validUsername, validEmailAddress } from '@/utlis/functions.util';
import InputButton from '../atoms/InputButton.vue';
import InputField from '../molecules/InputField.vue';
import ProfileBadge from '../atoms/ProfileBadge.vue';
import Spinner from '../atoms/Spinner.vue';

type ValidationType = {
  valid: () => boolean;
  msg: string;
};

type FormInputValidationType = {
  firstNameInput: ValidationType;
  lastNameInput: ValidationType;
  usernameInput: ValidationType;
  emailInput: ValidationType;
  passwordInput: ValidationType;
  confirmPasswordInput: ValidationType;
};

export default defineComponent({
  name: 'RegisterContainer',
  components: {
    InputButton,
    InputField,
    ProfileBadge,
    Spinner,
  },
  emits: ['submit', 'error'],
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String as PropType<'SUCCESS' | 'ERROR' | 'PENDING'>,
      required: true,
    },
  },
  setup(props, context) {
    const firstNameInput: Ref<string> = ref('');
    const lastNameInput: Ref<string> = ref('');
    const usernameInput: Ref<string> = ref('');
    const emailInput: Ref<string> = ref('');
    const passwordInput: Ref<string> = ref('');
    const confirmPasswordInput: Ref<string> = ref('');
    const isLoading = computed((): boolean => props.requestStatus === 'PENDING');
    const registerFormErrorClassModifier = computed(
      () => `register-container-error--${props.errorMessage.length > 0 ? 'visible' : 'hidden'}`,
    );
    const formValidationErrors = computed(
      (): FormInputValidationType => ({
        firstNameInput: {
          valid: () => firstNameInput.value.length > 0,
          msg: 'Please provide a first name',
        },
        lastNameInput: {
          valid: () => lastNameInput.value.length > 0,
          msg: 'Please provide a last name',
        },
        usernameInput: {
          valid: () => validUsername(usernameInput.value),
          msg: "The username can't contain a '#'",
        },
        emailInput: {
          valid: () => validEmailAddress(emailInput.value),
          msg: 'Please provide a valid email address',
        },
        passwordInput: {
          valid: () => passwordInput.value.length > 0,
          msg: 'Please provide a password',
        },
        confirmPasswordInput: {
          valid: () => confirmPasswordInput.value === passwordInput.value,
          msg: "The passwords don't match",
        },
      }),
    );
    const setFirstNameInput = (newValue: string) => {
      firstNameInput.value = newValue;
    };
    const setLastNameInput = (newValue: string) => {
      lastNameInput.value = newValue;
    };
    const setUsernameInput = (newValue: string) => {
      usernameInput.value = newValue;
    };
    const setEmailInput = (newValue: string) => {
      emailInput.value = newValue;
    };
    const setPasswordInput = (newValue: string) => {
      passwordInput.value = newValue;
    };
    const setConfirmPasswordInput = (newValue: string) => {
      confirmPasswordInput.value = newValue;
    };
    const formErrorMessage = computed(
      () => Object.values(formValidationErrors.value).find((value: ValidationType) => !value.valid())
        ?.msg ?? null,
    );
    const submitForm = () => {
      context.emit('submit', {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      });
    };
    const submitError = () => {
      context.emit('error', formErrorMessage.value);
    };
    const handleFormSubmit = () => {
      if (formErrorMessage.value) {
        submitError();
        return;
      }
      submitForm();
    };
    return {
      firstNameInput,
      lastNameInput,
      usernameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      formValidationErrors,
      isLoading,
      registerFormErrorClassModifier,
      setFirstNameInput,
      setLastNameInput,
      setUsernameInput,
      setEmailInput,
      setPasswordInput,
      setConfirmPasswordInput,
      handleFormSubmit,
    };
  },
});
</script>
