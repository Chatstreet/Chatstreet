<style lang="scss" src="@/styles/components/organisms/SettingsContainer.scss" scoped></style>

<template>
  <form class="settings-container" @submit.prevent="handleFromSubmit">
    <div>
      <div class="settings-container-primary">
        <div class="primary-profile-picture-wrapper">
          <profile-badge class="profile-picture-wrapper-image" :file="profilePictureInput" />
          <label class="profile-picture-wrapper-label" @click="handleUpdateProfilePictureClick"
            >Update Profile Picture</label
          >
          <input
            class="profile-picture-wrapper-input"
            type="file"
            name="profilePicture"
            accept="image/*"
            ref="imageInputElement"
            @change="handleUpdateProfileChange"
          />
        </div>
        <input-field
          class="primary-username-input"
          mode="sharp"
          v-model="usernameInput"
          @update="setUsernameInput"
          title="Username"
          :noValidation="true"
          background-color="var(--chatstreet-light-gray)"
          border-color="var(--chatstreet-gray)"
        />
      </div>
      <div class="settings-container-secondary">
        <!-- Change description to textarea -->
        <input-field
          mode="sharp"
          v-model="descriptionInput"
          @update="setDescriptionInput"
          title="Description"
          :noValidation="true"
          background-color="var(--chatstreet-light-gray)"
          border-color="var(--chatstreet-gray)"
        />
        <input-field
          mode="sharp"
          v-model="firstNameInput"
          @update="setFirstNameInput"
          title="First Name"
          :noValidation="true"
          background-color="var(--chatstreet-light-gray)"
          border-color="var(--chatstreet-gray)"
        />
        <input-field
          mode="sharp"
          v-model="lastNameInput"
          @update="setLastNameInput"
          title="Last Name"
          :noValidation="true"
          background-color="var(--chatstreet-light-gray)"
          border-color="var(--chatstreet-gray)"
        />
        <input-field
          mode="sharp"
          v-model="emailInput"
          @update="setEmailInput"
          title="Email Address"
          :disabled="true"
          :noValidation="true"
          background-color="var(--chatstreet-light-gray)"
          border-color="var(--chatstreet-gray)"
        />
      </div>
    </div>
    <div class="settings-container-buttons">
      <input-button class="buttons-update" mode="plain" type="submit">
        <template v-slot:content>
          <p class="button-content">Update Account</p>
        </template>
      </input-button>
      <input-button class="buttons-delete" mode="plain" type="button" :disabled="true">
        <template v-slot:content>
          <information-dialog class="buttons-delete-info" />
          <p class="button-content">Delete Account</p>
        </template>
      </input-button>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent, Ref, ref, PropType, watch,
} from 'vue';
import { fileToBase64 } from '@/utlis/functions.util';
import InputField from '../molecules/InputField.vue';
import InputButton from '../atoms/InputButton.vue';
import ProfileBadge from '../atoms/ProfileBadge.vue';
import InformationDialog from '../atoms/InformationDialog.vue';

type SettingsUserDataType = {
  username: string;
  profile: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default defineComponent({
  name: 'SettingsContainer',
  components: {
    InputField,
    InputButton,
    ProfileBadge,
    InformationDialog,
  },
  emits: ['submit'],
  props: {
    data: {
      type: Object as PropType<SettingsUserDataType>,
      required: true,
    },
  },
  setup(props, context) {
    const imageInputElement = ref();
    // TODO: Data will be fetched from store
    const profilePictureInput: Ref<string> = ref('');
    const usernameInput: Ref<string> = ref('');
    const descriptionInput: Ref<string> = ref('');
    const firstNameInput: Ref<string> = ref('');
    const lastNameInput: Ref<string> = ref('');
    const emailInput: Ref<string> = ref('');
    const handleFromSubmit = () => {
      context.emit('submit', {
        username: usernameInput.value,
        profile: profilePictureInput.value,
        description: descriptionInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
      });
    };
    const handleUpdateProfilePictureClick = () => {
      imageInputElement.value.click();
    };
    const handleUpdateProfileChange = async (event: any) => {
      const MEGA_BYTE = 1048576;
      const [file] = event.target.files;
      if (file.size > MEGA_BYTE) {
        // TODO: Implement
        alert('Image is to large');
        return;
      }
      profilePictureInput.value = (await fileToBase64(file)) as string;
    };
    const setUsernameInput = (value: string) => {
      usernameInput.value = value;
    };
    const setDescriptionInput = (value: string) => {
      descriptionInput.value = value;
    };
    const setFirstNameInput = (value: string) => {
      firstNameInput.value = value;
    };
    const setLastNameInput = (value: string) => {
      lastNameInput.value = value;
    };
    const setEmailInput = (value: string) => {
      emailInput.value = value;
    };
    watch(
      () => props.data,
      (newData: SettingsUserDataType) => {
        profilePictureInput.value = newData.profile;
        usernameInput.value = newData.username;
        descriptionInput.value = newData.description;
        firstNameInput.value = newData.firstName;
        lastNameInput.value = newData.lastName;
        emailInput.value = newData.email;
      },
      { immediate: true },
    );
    return {
      handleFromSubmit,
      handleUpdateProfilePictureClick,
      handleUpdateProfileChange,
      setUsernameInput,
      setDescriptionInput,
      setFirstNameInput,
      setLastNameInput,
      setEmailInput,
      profilePictureInput,
      imageInputElement,
      usernameInput,
      descriptionInput,
      firstNameInput,
      lastNameInput,
      emailInput,
    };
  },
});
</script>
