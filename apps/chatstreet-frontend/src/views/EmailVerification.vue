<style lang="scss" src="@/styles/views/EmailVerification.scss" scoped></style>

<template>
  <static-template>
    <template v-slot:main>
      <div class="email-verification-container">
        <verification-container :state="emailVerificationRequestStatus" :data="verificationData" />
      </div>
    </template>
  </static-template>
</template>

<script lang="ts">
import store from '@/store';
import {
  defineComponent, onMounted, computed, ref,
} from 'vue';
import { useRoute } from 'vue-router';

import StaticTemplate from '@/components/templates/StaticTemplate.vue';
import VerificationContainer from '@/components/organisms/VerificationContainer.vue';

export default defineComponent({
  name: 'EmailVerification',
  components: { StaticTemplate, VerificationContainer },
  setup() {
    const verificationData = ref({
      pending: {
        title: 'Processing ...',
        info: '',
      },
      success: {
        title: 'Verified!',
        info: "Let's goo! Your account has been successfully verified.",
      },
      error: {
        title: 'Invalid Code',
        info: 'It seems like your verification code is not valid...',
      },
    });
    const route = useRoute();
    onMounted(() => {
      const code: string = route.params.code as string;
      store.dispatch('account/postVerifyEmail', { code });
    });
    const emailVerificationRequestStatus = computed(
      () => store.getters['account/getVerifyEmailRequest'].status,
    );
    return {
      emailVerificationRequestStatus,
      verificationData,
    };
  },
});
</script>
