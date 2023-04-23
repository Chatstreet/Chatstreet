<style lang="scss" src="@/styles/components/atoms/InputButton.scss" scoped></style>

<template>
  <button class="input-button" :class="buttonModeClassModifier">
    <slot name="content"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

type ButtonModeType = 'default' | 'confirm' | 'plain';

export default defineComponent({
  name: 'InputButton',
  props: {
    mode: {
      type: String as PropType<ButtonModeType>,
      default: 'default',
    },
  },
  setup(props, context) {
    const buttonModeClassModifier = computed(() => `input-button--${props.mode}`);
    return {
      buttonModeClassModifier,
    };
  },
});
</script>
