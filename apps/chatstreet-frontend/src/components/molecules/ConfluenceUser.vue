<style lang="scss" src="@/styles/components/molecules/ConfluenceUser.scss" scoped></style>

<template>
  <div class="confluence-user">
    <p class="confluence-user-user">{{ user }}</p>
    <div v-if="inbox" class="confluence-user-buttons">
      <input-button
        class="buttons-confirm"
        mode="confirm"
        type="button"
        @click="handleAcceptUserClick()"
      >
        <template v-slot:content>
          <span class="button-content icon-confirm" />
        </template>
      </input-button>
      <input-button
        class="buttons-decline"
        mode="decline"
        type="button"
        @click="handleDeclineUserClick()"
      >
        <template v-slot:content>
          <span class="button-content icon-decline" />
        </template>
      </input-button>
    </div>
    <p v-else class="confluence-user-status">Pending...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputButton from '../atoms/InputButton.vue';

export default defineComponent({
  name: 'ConfluenceUser',
  components: { InputButton },
  emits: ['accept', 'decline'],
  props: {
    user: {
      type: String,
      required: true,
    },
    inbox: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, context) {
    const handleAcceptUserClick = () => context.emit('accept');
    const handleDeclineUserClick = () => context.emit('decline');
    return {
      handleAcceptUserClick,
      handleDeclineUserClick,
    };
  },
});
</script>
