<style lang="scss" src="@/styles/components/templates/RegisterTemplate.scss" scoped></style>

<template>
  <div class="register-template">
    <header class="register-template-header">
      <slot name="header"></slot>
    </header>
    <main class="register-template-main">
      <slot name="main"></slot>
    </main>
    <footer class="register-template-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterTemplate',
  setup() {
    return {};
  },
});
</script>
