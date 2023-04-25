<style lang="scss" src="@/styles/components/templates/StaticTemplate.scss" scoped></style>

<template>
  <main class="static-template">
    <div class="static-template-overlay" />
    <div class="static-template-content">
      <slot name="main"></slot>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StaticTemplate',
  setup() {
    return {};
  },
});
</script>
