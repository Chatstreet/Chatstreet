<style lang="scss" src="@/styles/components/organisms/ConfluenceContainer.scss" scoped></style>

<template>
  <div class="confluence-container">
    <div class="confluence-container-header">
      <h3 class="header-title">{{ confluenceContainerHeaderName }}</h3>
      <switcher class="header-switcher" v-model:modelValue="switcherData" />
    </div>
    <div class="confluence-container-content">
      <div v-if="isInvite" class="content-wrapper">
        <form class="content-wrapper-form" @submit.prevent="handleFormSubmit()">
          <input-field
            v-model="userInviteInput"
            @update="setUserInviteInput"
            title="Username#Tag"
            :valid="isUserInviteInputValid"
            background-color="var(--chatstreet-light-gray)"
            border-color="var(--chatstreet-gray)"
          />
          <input-button class="form-button" type="submit">
            <template v-slot:content>
              <p class="button-content">Invite</p>
            </template>
          </input-button>
        </form>
        <div class="content-wrapper-divider" />
        <p v-if="!hasInvited" class="content-wrapper-info">No one invited yet ...</p>
        <confluence-user v-for="user in userInvited.invited" :key="user.user" :user="user.user" />
      </div>
      <div v-else class="content-wrapper">
        <p v-if="!hasInvites" class="content-wrapper-info">Ups, nobody invited you :&#40;</p>
        <confluence-user
          v-for="user in userInvites.invites"
          :key="user.user"
          :user="user.user"
          :inbox="true"
          @accept="handleConfluenceUserAccept(user.user)"
          @decline="handleConfluenceUserDecline(user.user)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, Ref, ref, computed, mergeProps,
} from 'vue';
import {
  FetchInvitedUsersResponseType,
  FetchUserInvitesResponseType,
} from '@/services/types/response.type';
import { validUser } from '@/utlis/functions.util';
import Switcher from '../molecules/Switcher.vue';
import ConfluenceUser from '../molecules/ConfluenceUser.vue';
import InputButton from '../atoms/InputButton.vue';
import InputField from '../molecules/InputField.vue';

export default defineComponent({
  name: 'ConfluenceContainer',
  components: {
    Switcher,
    ConfluenceUser,
    InputButton,
    InputField,
  },
  emits: ['submit', 'acceptInvite', 'declineInvite'],
  props: {
    userInvited: {
      type: Object as PropType<FetchInvitedUsersResponseType>,
      required: true,
    },
    userInvites: {
      type: Object as PropType<FetchUserInvitesResponseType>,
      required: true,
    },
  },
  setup(props, context) {
    const switcherData = ref([
      {
        name: 'Your Invitations',
        active: true,
        id: 1,
      },
      {
        name: 'Your Inbox',
        active: false,
        id: 2,
      },
    ]);
    const userInviteInput: Ref<string> = ref('');
    const isInvite = computed((): boolean => switcherData.value[0].active);
    const isUserInviteInputValid = computed((): boolean => validUser(userInviteInput.value));
    const confluenceContainerHeaderName = computed((): string => (isInvite.value ? 'Invite Your Friends' : 'Who Has Invited You?'));
    const hasInvited = computed(
      (): boolean => !!props.userInvited?.invited && props.userInvited.invited.length > 0,
    );
    const hasInvites = computed(
      (): boolean => !!props.userInvites?.invites && props.userInvites.invites.length > 0,
    );
    const setUserInviteInput = (value: string) => {
      userInviteInput.value = value;
    };
    const handleConfluenceUserAccept = (user: string) => {
      context.emit('acceptInvite', user);
    };
    const handleConfluenceUserDecline = (user: string) => {
      context.emit('declineInvite', user);
    };
    const handleFormSubmit = () => {
      if (!isUserInviteInputValid.value) {
        return;
      }
      context.emit('submit', userInviteInput.value);
    };
    return {
      switcherData,
      isInvite,
      confluenceContainerHeaderName,
      handleConfluenceUserAccept,
      handleConfluenceUserDecline,
      userInviteInput,
      setUserInviteInput,
      handleFormSubmit,
      isUserInviteInputValid,
      hasInvited,
      hasInvites,
    };
  },
});
</script>
