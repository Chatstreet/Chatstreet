<style lang="scss" src="@/styles/components/organisms/ThemesContainer.scss" scoped></style>

<template>
  <div class="themes-container">
    <div class="themes-container-content">
      <theme
        v-for="theme in userThemes"
        :key="theme.id"
        :theme="theme"
        v-model:open="theme.open"
        @open="handleThemeClick(theme.id)"
        @close="handleThemeClose"
        :contacts="userFriends.friends ?? []"
      />
    </div>
    <div class="themes-container-divider" />
    <div class="themes-container-add">
      <input-button class="add-button" @click="handleAddThemeClick">
        <template v-slot:content>
          <span class="button-content icon-plus" />
        </template>
      </input-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, PropType,
} from 'vue';
import { FetchUserFriendsResponseType } from '@/services/types/response.type';
import Theme from '../molecules/Theme.vue';
import InputButton from '../atoms/InputButton.vue';

type UserTheme = {
  id: number;
  name: string;
  color: string;
  open: boolean;
};

export default defineComponent({
  name: 'ThemesContainer',
  components: { InputButton, Theme },
  props: {
    userFriends: {
      type: Object as PropType<FetchUserFriendsResponseType>,
      required: true,
    },
  },
  setup(props) {
    const userThemes: Ref<UserTheme[]> = ref([
      {
        id: 1,
        name: 'All Friends',
        color: '#ffaec9',
        open: false,
      },
      {
        id: 2,
        name: 'Family',
        color: '#b5e61d',
        open: false,
      },
      {
        id: 3,
        name: 'Work',
        color: '#99d9ea',
        open: false,
      },
    ]);
    const handleThemeClick = (id: number) => {
      userThemes.value = userThemes.value.map((theme: UserTheme): UserTheme => {
        if (theme.id !== id || theme.open) {
          return theme;
        }
        return {
          ...theme,
          open: true,
        };
      });
    };
    const handleThemeClose = () => {
      userThemes.value = userThemes.value.map(
        (theme: UserTheme): UserTheme => ({
          ...theme,
          open: false,
        }),
      );
    };
    const handleAddThemeClick = () => {
      // TODO: Implement
      alert('Not implemented in MVP');
    };
    return {
      handleThemeClick,
      handleAddThemeClick,
      handleThemeClose,
      userThemes,
    };
  },
});
</script>
