<style lang="scss" src="@/styles/views/EmailVerification.scss" scoped></style>

<template>
  <main>Email Verification {{ $route.params.code }}</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmailVerification',
  setup() {
    return {};
  },
});
</script>
