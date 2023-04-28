<style lang="scss" src="@/styles/components/molecules/Switcher.scss" scoped></style>

<template>
  <div class="switcher">
    <input-button
      class="switcher-button"
      v-for="option in modelValue"
      :key="option.id"
      mode="plain"
      :class="switcherButtonClassModifier(option.active)"
      @click="handleInputButtonClick(option.id)"
    >
      <template v-slot:content>
        <div class="button-content">
          <p>{{ option.name }}</p>
        </div>
      </template>
    </input-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import InputButton from '../atoms/InputButton.vue';

type SwticherDataType = {
  name: string;
  active: boolean;
  id: number;
};

export default defineComponent({
  name: 'Switcher',
  components: { InputButton },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object as PropType<SwticherDataType[]>,
      required: true,
    },
  },
  setup(props, context) {
    const switcherButtonClassModifier = (active: boolean): string => (active ? 'switcher-button--active' : '');
    const handleInputButtonClick = (id: number): void => {
      const innerModelValue = [...props.modelValue].map((option: any) => ({
        ...option,
        active: option.id === id,
      }));
      context.emit('update:modelValue', innerModelValue);
    };
    return {
      switcherButtonClassModifier,
      handleInputButtonClick,
    };
  },
});
</script>
