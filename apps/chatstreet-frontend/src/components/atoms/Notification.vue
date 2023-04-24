<style lang="scss" src="@/styles/components/atoms/Notification.scss" scoped></style>

<template>
  <div class="notification" :class="notificationStateModifierClass">
    <span class="notification-text" :class="notificationModeModifierClass">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, watch, PropType,
} from 'vue';

type NotificationModeType = 'error' | 'success' | 'info';

export default defineComponent({
  name: 'Notification',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    delay: {
      type: Number,
      default: 4,
    },
    mode: {
      type: String as PropType<NotificationModeType>,
      default: 'info',
    },
  },
  setup(props, context) {
    const state = computed({
      get(): boolean {
        return props.modelValue;
      },
      set(newValue: boolean): void {
        context.emit('update:modelValue', newValue);
      },
    });
    const notificationStateModifierClass = computed(
      () => `notification--${state.value ? 'open' : 'closed'}`,
    );
    const notificationModeModifierClass = computed(() => `notification-text--${props.mode}`);
    const hide = () => {
      state.value = false;
    };
    watch(
      () => state.value,
      (newValue: boolean) => {
        if (!newValue) {
          return;
        }
        setTimeout(hide, props.delay * 1000);
      },
    );

    return {
      notificationStateModifierClass,
      notificationModeModifierClass,
    };
  },
});
</script>
