<style lang="scss" src="@/styles/components/molecules/InputField.scss" scoped></style>

<template>
  <div
    class="input-field"
    :class="[fieldModeClassModifier, fieldErrorClassModifier]"
    :style="inputFieldBackgroundColorStyle"
  >
    <label v-if="hasTitle" class="input-field-title" :class="titleStateClassModifier">{{
      title
    }}</label>
    <input
      class="input-field-input"
      v-model="inputValue"
      :type="innerInputType"
      @focus="setInputFocused(true)"
      @blur="setInputFocused(false)"
      :disabled="disabled"
      required
    />
    <input-button
      v-if="isPassword"
      class="input-field-button"
      mode="plain"
      type="button"
      @click="togglePeekPassword"
    >
      <template v-slot:content>
        <div class="button-content">
          <span v-if="peekPassword" class="icon-eye-open" />
          <span v-else class="icon-eye-closed" />
        </div>
      </template>
    </input-button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, WritableComputedRef, PropType, ref,
} from 'vue';

import InputButton from '../atoms/InputButton.vue';

type FieldModeType = 'default' | 'sharp';
type InputType = 'email' | 'hidden' | 'number' | 'password' | 'search' | 'text';

export default defineComponent({
  name: 'InputField',
  components: { InputButton },
  emits: ['update'],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    valid: {
      type: Boolean,
    },
    noValidation: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<FieldModeType>,
      default: 'default',
    },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    borderColor: {
      type: String,
      default: 'var(--chatstreet-light-gray)',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const inputFocused = ref(false);
    const peekPassword = ref(false);
    const inputValue: WritableComputedRef<string> = computed({
      get(): string {
        return props.modelValue;
      },
      set(newValue: string): void {
        context.emit('update', newValue);
      },
    });
    const fieldModeClassModifier = computed((): string => `input-field--${props.mode}`);
    const fieldErrorClassModifier = computed((): string => {
      if (inputValue.value === '' || props.noValidation) {
        return '';
      }
      return `input-field--${props.valid ? 'valid' : 'error'}`;
    });
    const titleStateClassModifier = computed((): string => (inputFocused.value || inputValue.value.length > 0 ? 'input-field-title--focus' : ''));
    const isPassword = computed(() => props.type === 'password');
    const hasTitle = computed(() => props.title !== null);
    const innerInputType = computed(() => {
      if (props.type === 'password') {
        return peekPassword.value ? 'text' : 'password';
      }
      return props.type;
    });
    const togglePeekPassword = () => {
      peekPassword.value = !peekPassword.value;
    };
    const setInputFocused = (value: boolean) => {
      inputFocused.value = value;
    };
    const inputFieldBackgroundColorStyle = computed(
      () => `--background-color: ${props.backgroundColor};\n--border-color: ${props.borderColor};`,
    );
    return {
      togglePeekPassword,
      setInputFocused,
      isPassword,
      hasTitle,
      peekPassword,
      fieldModeClassModifier,
      fieldErrorClassModifier,
      titleStateClassModifier,
      inputFieldBackgroundColorStyle,
      inputValue,
      innerInputType,
    };
  },
});
</script>
