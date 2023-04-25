<style lang="scss" src="@/styles/components/atoms/InputButton.scss" scoped></style>

<template>
  <button
    class="input-button"
    :class="[buttonModeClassModifier, buttonDisabledClassModifier]"
    :disabled="disabled"
  >
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonModeClassModifier = computed(() => `input-button--${props.mode}`);
    const buttonDisabledClassModifier = computed(() => (props.disabled ? 'input-button--disabled' : ''));
    return {
      buttonModeClassModifier,
      buttonDisabledClassModifier,
    };
  },
});
</script>
