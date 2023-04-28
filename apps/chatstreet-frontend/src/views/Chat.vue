<style lang="scss" src="@/styles/views/Chat.scss" scoped></style>

<template>
  <main class="chat">
    Chat {{ $route.params.user }} <br />
    Unfortunatly our time buget ran out so you won't be able to chat right now. This feature will be
    implemented in the near future, thanks for your patience.
  </main>
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
