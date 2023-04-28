<style lang="scss" src="../styles/views/Home.scss" scoped></style>

<template>
  <home-template>
    <template v-slot:header>
      <div v-if="isConfluence" class="home-header-wrapper">
        <h2>Confluence</h2>
      </div>
      <div v-if="isThemes" class="home-header-wrapper">
        <h2>Themes</h2>
      </div>
      <div v-if="isSettings" class="home-header-wrapper">
        <h2>Settings</h2>
      </div>
      <div class="home-header-profile">
        <profile-badge
          class="header-profile-badge"
          :file="settingsContainerUserData.profile"
          @click="handleHomeHeaderProfileClick"
        />
        <ul v-if="isProfileContextOpen" class="header-profile-context">
          <li class="profile-context-item" @click="handleLogoutClick">Logout</li>
        </ul>
      </div>
    </template>
    <template v-slot:main>
      <themes-container class="home-main-themes" />
      <confluence-container
        class="home-main-confluence"
        :class="homeConfluenceTransitionClassModifier"
        :userInvited="userInvited"
        :userInvites="userInvites"
        @submit="handleConfluenceContainerSubmit"
        @acceptInvite="handleConfluenceContainerAcceptInvite"
        @declineInvite="handleConfluenceContainerDeclineInvite"
      />
      <settings-container
        class="home-main-settings"
        :class="homeSettingsTransitionClassModifier"
        :data="settingsContainerUserData"
        @submit="handleSettingsContainerSubmit"
      />
    </template>
  </home-template>
  <notification
    v-model:model-value="showNotification"
    :value="notificationTitle"
    :mode="notificationType"
  />
</template>

<script lang="ts">
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import {
  defineComponent, computed, watch, onMounted, Ref, ref,
} from 'vue';
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router';
import HomeTemplate from '@/components/templates/HomeTemplate.vue';
import ConfluenceContainer from '@/components/organisms/ConfluenceContainer.vue';
import ThemesContainer from '@/components/organisms/ThemesContainer.vue';
import SettingsContainer from '@/components/organisms/SettingsContainer.vue';
import Notification from '@/components/atoms/Notification.vue';
import ProfileBadge from '@/components/atoms/ProfileBadge.vue';
import store from '@/store';
import Playbook from '@/playbook/playbook';
import { clearAllCookies } from '@/utlis/cookie.util';
import {
  FetchInvitedUsersResponseType,
  FetchUserInvitesResponseType,
} from '@/services/types/response.type';

type SettingsContainerDataType = {
  username: string;
  profile: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default defineComponent({
  name: 'Home',
  components: {
    HomeTemplate,
    ConfluenceContainer,
    ThemesContainer,
    SettingsContainer,
    Notification,
    ProfileBadge,
  },
  setup() {
    const CONFLUENCE_HASH = '#confluence';
    const THEMES_HASH = '#themes';
    const SETTINGS_HASH = '#settings';

    const isProfileContextOpen: Ref<boolean> = ref(false);
    const notificationType: Ref<'error' | 'success' | 'info'> = ref('info');
    const notificationTitle = ref('');
    const showNotification = ref(false);
    const notify = (type: 'error' | 'success' | 'info' = 'error', title: string) => {
      notificationTitle.value = title;
      notificationType.value = type;
      showNotification.value = true;
    };

    const route: RouteLocationNormalizedLoaded = useRoute();

    const isConfluence = computed((): boolean => route.hash === CONFLUENCE_HASH);
    const isThemes = computed((): boolean => route.hash === THEMES_HASH);
    const isSettings = computed((): boolean => route.hash === SETTINGS_HASH);
    const isValidHash = computed(
      (): boolean => isConfluence.value || isThemes.value || isSettings.value,
    );
    const userInvited = computed(() => store.getters['user/getInvitedUsersRequestResult'][0] ?? {});
    const userInvites = computed(() => store.getters['user/getUserInvitesRequestResult'][0] ?? {});
    watch(
      () => isValidHash.value,
      (isValid: boolean) => {
        if (!isValid) {
          router.push({ hash: THEMES_HASH });
        }
      },
      { immediate: true },
    );

    const homeConfluenceTransitionClassModifier = computed(
      () => `home-main-confluence--${isConfluence.value ? 'visible' : 'hidden'}`,
    );
    const homeSettingsTransitionClassModifier = computed(
      () => `home-main-settings--${isSettings.value ? 'visible' : 'hidden'}`,
    );
    const userDataResponseState = computed(
      () => store.getters['user/getUserDataRequest']?.result?.user ?? null,
    );
    const settingsContainerUserData = computed((): SettingsContainerDataType => {
      if (!userDataResponseState.value) {
        // TODO: Better handle in component itself
        return {
          username: '',
          profile: '',
          description: '',
          firstName: '',
          lastName: '',
          email: '',
        };
      }
      return {
        username: userDataResponseState.value.username,
        profile: userDataResponseState.value.profile ?? '',
        description: userDataResponseState.value.description,
        firstName: userDataResponseState.value.first_name,
        lastName: userDataResponseState.value.last_name,
        email: userDataResponseState.value.email,
      };
    });

    const fetchInvited = () => store.dispatch('user/fetchInvitedUsers');
    const fetchInvites = () => store.dispatch('user/fetchUserInvites');
    const fetchUserData = () => store.dispatch('user/fetchUserData');

    onMounted(() => {
      fetchInvited();
      fetchInvites();
      fetchUserData();
    });

    watch(
      () => route.hash,
      (to: string, from: string) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Navigator] [From] ${from}`);
          console.log(`[Navigator] [To] ${to}`);
        }
        switch (from) {
          case '#confluence': {
            break;
          }
          case '#themes': {
            break;
          }
          case '#settings': {
            fetchUserData();
            break;
          }
          default: {
            break;
          }
        }
        switch (to) {
          case '#confluence': {
            break;
          }
          case '#themes': {
            break;
          }
          case '#settings': {
            break;
          }
          default: {
            break;
          }
        }
      },
    );
    const handleSettingsContainerSubmit = (data: SettingsContainerDataType) => {
      Playbook.play('USER_DATA_UPDATE', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.username,
        profile: data.profile,
        description: data.description,
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          notify('error', errorMessage);
          return;
        }
        notify('info', 'Successfully updated profile');
      });
    };
    const handleConfluenceContainerSubmit = (user: string) => {
      Playbook.play('USER_INVITE_USER', {
        username: user.split('#')[0],
        userTag: parseInt(user.split('#')[1], 10),
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          notify('error', errorMessage);
          return;
        }
        notify('info', `Successfully invited ${user.split('#')[0]}!`);
      });
      fetchInvited();
    };
    const handleConfluenceContainerDeclineInvite = (user: string) => {
      Playbook.play('USER_INVITATION_RESPONSE', {
        username: user.split('#')[0],
        userTag: parseInt(user.split('#')[1], 10),
        response: 'DECLINE',
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          notify('error', errorMessage);
          return;
        }
        notify('info', `Successfully declined ${user.split('#')[0]}'s invite!`);
      });
      fetchInvites();
    };
    const handleConfluenceContainerAcceptInvite = (user: string) => {
      Playbook.play('USER_INVITATION_RESPONSE', {
        username: user.split('#')[0],
        userTag: parseInt(user.split('#')[1], 10),
        response: 'ACCEPT',
      }).then((errorMessage: string | null) => {
        if (errorMessage) {
          notify('error', errorMessage);
          return;
        }
        notify('info', `Successfully accepted ${user.split('#')[0]}!'s invite!`);
      });
      fetchInvites();
    };
    const handleHomeHeaderProfileClick = () => {
      isProfileContextOpen.value = !isProfileContextOpen.value;
    };
    const handleLogoutClick = () => {
      clearAllCookies();
      router.push({ name: 'Login' });
    };
    return {
      handleSettingsContainerSubmit,
      handleConfluenceContainerSubmit,
      handleConfluenceContainerDeclineInvite,
      handleConfluenceContainerAcceptInvite,
      handleHomeHeaderProfileClick,
      handleLogoutClick,
      isProfileContextOpen,
      notificationType,
      notificationTitle,
      showNotification,
      homeConfluenceTransitionClassModifier,
      homeSettingsTransitionClassModifier,
      isConfluence,
      isThemes,
      isSettings,
      settingsContainerUserData,
      userInvited,
      userInvites,
    };
  },
});
</script>
