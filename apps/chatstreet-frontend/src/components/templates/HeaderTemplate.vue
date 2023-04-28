<style lang="scss" src="@/styles/components/templates/HeaderTemplate.scss" scoped></style>

<template>
  <header class="header-template">
    <slot name="content"></slot>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderTemplate',
  setup() {
    return {};
  },
});
</script>
