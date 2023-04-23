<style lang="scss" src="@/styles/components/templates/LoginTemplate.scss" scoped></style>

<template>
  <div class="login-template">
    <header class="login-template-header">
      <slot name="header"></slot>
    </header>
    <main class="login-template-main">
      <slot name="main"></slot>
    </main>
    <footer class="login-template-footer">
      <div class="footer-shape" />
      <div class="footer-content">
        <slot name="footer"></slot>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginTemplate',
  setup() {
    return {};
  },
});
</script>
