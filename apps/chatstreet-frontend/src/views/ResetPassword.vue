<style lang="scss" src="@/styles/views/ResetPassword.scss" scoped></style>

<template>
  <static-template>
    <template v-slot:main>
      <div class="reset-password-container">
        <verification-container
          :state="changePasswordRequestStatus"
          :data="verificationData"
          v-if="submitted"
        />
        <change-password-container v-else @submit="handleChangePasswordSubmit" />
      </div>
    </template>
  </static-template>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, computed,
} from 'vue';
import StaticTemplate from '@/components/templates/StaticTemplate.vue';
import VerificationContainer from '@/components/organisms/VerificationContainer.vue';
import ChangePasswordContainer from '@/components/organisms/ChangePasswordContainer.vue';
import { useRoute } from 'vue-router';
import store from '@/store';

export default defineComponent({
  name: 'ResetPassword',
  components: { StaticTemplate, VerificationContainer, ChangePasswordContainer },
  setup() {
    const verificationData = ref({
      pending: {
        title: 'Processing ...',
        info: '',
      },
      success: {
        title: 'Password Changed!',
        info: 'Your password has been successfully changed. Proceed by logging into your account.',
      },
      error: {
        title: 'Invalid Code',
        info: 'It seems like your password code is not valid... Try to request a new email.',
      },
    });
    const code: string = useRoute().params.code as string;
    const submitted: Ref<boolean> = ref(false);
    const handleChangePasswordSubmit = (password: string) => {
      submitted.value = true;
      store.dispatch('account/postChangePassword', {
        code,
        password,
      });
    };
    const changePasswordRequestStatus = computed(
      () => store.getters['account/getChangePasswordRequest'].status,
    );
    return {
      handleChangePasswordSubmit,
      changePasswordRequestStatus,
      verificationData,
      submitted,
    };
  },
});
</script>
