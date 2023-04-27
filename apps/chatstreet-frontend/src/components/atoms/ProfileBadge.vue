<style lang="scss" src="@/styles/components/atoms/ProfileBadge.scss" scoped></style>

<template>
  <div class="profile-badge">
    <img v-if="hasProfileImage" />
    <span v-else class="icon-profile" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ProfileBadge',
  props: {
    buffer: {
      type: Buffer,
      default: Buffer.from('', 'utf-8'),
    },
  },
  setup(props) {
    const hasProfileImage = computed(() => props.buffer.length > 0);
    return {
      hasProfileImage,
    };
  },
});
</script>
