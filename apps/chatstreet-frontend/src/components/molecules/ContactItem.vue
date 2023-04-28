<style lang="scss" src="@/styles/components/molecules/ContactItem.scss" scoped></style>

<template>
  <div class="contact-item-wrapper">
    <div class="contact-item">
      <profile-badge class="contact-item-profile" />
      <p class="contact-item-user">{{ contact.user }}</p>
    </div>
    <div class="divider" />
  </div>
</template>

<script lang="ts">
import { UserInviteType } from '@/services/types/response.type';
import { defineComponent, PropType } from 'vue';
import ProfileBadge from '../atoms/ProfileBadge.vue';

export default defineComponent({
  name: 'ContactItem',
  components: { ProfileBadge },
  props: {
    contact: {
      type: Object as PropType<UserInviteType>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
