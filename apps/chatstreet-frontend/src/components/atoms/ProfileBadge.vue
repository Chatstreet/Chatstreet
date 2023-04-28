<style lang="scss" src="@/styles/components/atoms/ProfileBadge.scss" scoped></style>

<template>
  <div class="profile-badge">
    <img v-if="hasProfileImage" :src="profileBadgeImageSource" class="profile-badge-image" />
    <div v-else class="profile-badge-no-image">
      <span class="icon-profile" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ComputedRef, computed, PropType,
} from 'vue';

export default defineComponent({
  name: 'ProfileBadge',
  props: {
    file: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const hasProfileImage = computed(() => props.file.length > 0);
    const profileBadgeImageSource: ComputedRef<string> = computed((): string => props.file);
    return {
      hasProfileImage,
      profileBadgeImageSource,
    };
  },
});
</script>
