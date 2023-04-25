<style lang="scss" src="@/styles/components/organisms/VerificationContainer.scss" scoped></style>

<template>
  <form class="verification-container" @submit.prevent="handleFormSubmit">
    <span class="verification-container-icon" :class="verificationContainerIconClass" />
    <h2 class="verification-container-title">{{ computedTitle }}</h2>
    <p class="verification-container-info">{{ computedInfo }}</p>
    <input-button
      class="verification-container-button"
      mode="confirm"
      type="submit"
      :disabled="isLoading"
    >
      <template v-slot:content>
        <div class="button-content">
          <span class="icon-arrow-right" />
        </div>
      </template>
    </input-button>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import router from '@/router';
import InputButton from '../atoms/InputButton.vue';

type VerificationContainerDisplay = {
  title: string;
  info: string;
};

type VerificationContainerDisplayMap = {
  pending: VerificationContainerDisplay;
  success: VerificationContainerDisplay;
  error: VerificationContainerDisplay;
};

export default defineComponent({
  name: 'VerificationContainer',
  components: { InputButton },
  props: {
    state: {
      type: String as PropType<'PENDING' | 'SUCCESS' | 'ERROR' | undefined>,
      required: true,
    },
    data: {
      type: Object as PropType<VerificationContainerDisplayMap>,
      required: true,
    },
  },
  setup(props) {
    const handleFormSubmit = () => {
      router.push({ name: 'Home' });
    };

    const isLoading = computed(() => props.state === 'PENDING' || !props.state);
    const isSuccess = computed(() => props.state === 'SUCCESS');
    const isFailure = computed(() => props.state === 'ERROR');

    const verificationContainerIconClass = computed(() => {
      if (isLoading.value) return 'icon-loading';
      if (isSuccess.value) return 'icon-success';
      if (isFailure.value) return 'icon-error';
      return '';
    });
    const computedTitle = computed(() => {
      if (isLoading.value) return props.data.pending.title;
      if (isSuccess.value) return props.data.success.title;
      if (isFailure.value) return props.data.error.title;
      return '';
    });
    const computedInfo = computed(() => {
      if (isLoading.value) return props.data.pending.info;
      if (isSuccess.value) return props.data.success.info;
      if (isFailure.value) return props.data.error.info;
      return '';
    });
    return {
      handleFormSubmit,
      verificationContainerIconClass,
      computedTitle,
      computedInfo,
      isLoading,
    };
  },
});
</script>
