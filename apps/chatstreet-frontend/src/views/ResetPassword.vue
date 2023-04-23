<style lang="scss" src="@/styles/views/ResetPassword.scss" scoped></style>

<template>
  <main>Reset Password {{ $route.params.code }}</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResetPassword',
  setup() {
    return {};
  },
});
</script>
