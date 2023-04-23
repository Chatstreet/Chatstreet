<style lang="scss" src="@/styles/views/Chat.scss" scoped></style>

<template>
  <main>Chat {{ $route.params.user }}</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Chat',
  setup() {
    return {};
  },
});
</script>
