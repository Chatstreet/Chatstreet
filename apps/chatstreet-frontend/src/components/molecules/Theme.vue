<style lang="scss" src="@/styles/components/molecules/Theme.scss" scoped></style>

<template>
  <div class="theme" :class="themeStateClassModifier">
    <div class="theme-header" :style="themeHeaderBackgroundColorStyleModifier">
      <input-button v-if="open" class="theme-header-button" @click="handleCloseThemeClick">
        <template v-slot:content>
          <span class="button-content icon-back" />
        </template>
      </input-button>
      <p class="theme-header-title">{{ theme.name }}</p>
    </div>
    <div class="theme-main" @click="handleMainClick">
      <p v-if="!open" class="theme-main-info">Click To Open</p>
      <div v-else class="theme-main-contacts">
        <contact-item
          v-for="contact in contacts"
          :key="contact.user"
          :contact="contact"
          @click="handleContactItemClick(contact.user)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserInviteType } from '@/services/types/response.type';
import {
  defineComponent, PropType, ComputedRef, computed,
} from 'vue';
import router from '@/router';
import InputButton from '../atoms/InputButton.vue';
import ContactItem from './ContactItem.vue';

type UserTheme = {
  id: number;
  name: string;
  color: string;
};

export default defineComponent({
  name: 'Theme',
  components: { InputButton, ContactItem },
  emits: ['open', 'close'],
  props: {
    theme: {
      type: Object as PropType<UserTheme>,
      required: true,
    },
    contacts: {
      type: Array as PropType<UserInviteType[]>,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    const themeStateClassModifier: ComputedRef<string> = computed(
      (): string => `theme${props.open ? '--open' : '--closed'}`,
    );
    const themeHeaderBackgroundColorStyleModifier: ComputedRef<string> = computed(
      (): string => `background-color: ${props.theme.color};`,
    );
    const handleCloseThemeClick = () => {
      context.emit('close');
    };
    const handleMainClick = () => {
      context.emit('open');
    };
    const handleContactItemClick = (user: string) => {
      router.push({ name: 'Chat', params: { user } });
    };
    return {
      handleCloseThemeClick,
      handleMainClick,
      handleContactItemClick,
      themeStateClassModifier,
      themeHeaderBackgroundColorStyleModifier,
    };
  },
});
</script>
