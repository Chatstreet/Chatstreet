<style lang="scss" src="@/styles/components/atoms/InformationDialog.scss" scoped></style>

<template>
  <div class="information-dialog">
    <span class="icon-info" />
    <p class="information-dialog-text">{{ info }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InformationDialog',
  props: {
    info: {
      type: String,
      default: 'This feature is not implemented in the MVP yet.',
    },
  },
  setup() {
    return {};
  },
});
</script>
