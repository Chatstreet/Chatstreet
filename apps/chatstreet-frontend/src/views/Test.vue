<style lang="scss" src="../styles/views/Test.scss" scoped></style>

<template>
  <main>
    <h1>Token Controller</h1>
    <hr />
    <h2>Register User</h2>
    <input placeholder="First Name" v-model="firstNameInput" required />
    <input placeholder="Last Name" v-model="lastNameInput" required />
    <input placeholder="Username" v-model="usernameRegisterInput" required />
    <input placeholder="Password" type="password" v-model="passwordRegisterInput" required />
    <input
      placeholder="Verify Password"
      type="password"
      v-model="passwordVerificationRegisterInput"
      required
    />
    <input placeholder="Email" v-model="emailInput" required />
    <button @click="handleRegisterUserClick">Register</button>
    <p>Register Response: {{ regiserUserState }}</p>
    <h2>Verify Email</h2>
    <input placeholder="Verification Code" v-model="emailVerificationCodeInput" required />
    <button @click="handleVerifyEmailClick">Verify</button>
    <p>Verification Response: {{ verifyEmailState }}</p>
    <h2>Login</h2>
    <input placeholder="User" v-model="userLoginInput" required />
    <input placeholder="Password" type="password" v-model="passwordLoginInput" required />
    <button @click="handleLoginClick">Login</button>
    <p>Login Response: {{ loginState }}</p>
    <h2>Refresh</h2>
    <button @click="handleRefreshClick">Refresh</button>
    <p>Refresh Response: {{ refreshState }}</p>
    <h2>Logout</h2>
    <button @click="handleLogoutClick">Logout</button>
    <p>Logout Response: {{ logoutState }}</p>
    <h2>Forgot Password</h2>
    <input placeholder="Username" v-model="usernameResetPasswordInput" required />
    <button @click="handleResetPasswordClick">Send</button>
    <p>Reset Password Response: {{ resetPasswordStatus }}</p>
    <h2>Change Password</h2>
    <input placeholder="Reset Password Code" v-model="passwordVerificationCodeInput" required />
    <input placeholder="New Password" type="password" v-model="passwordResetInput" />
    <input
      placeholder="Repeat New Password"
      type="password"
      v-model="passwordVerificationResetInput"
    />
    <button @click="handleChangePasswordClick">Change</button>
    <p>Change Password Response: {{ changePasswordState }}</p>
    <h1>API Controller</h1>
    <hr />
    <i>Only works if logged in</i>
    <h2>Get User Data</h2>
    <button @click="handleGetUserDataClick">Fetch</button>
    <p>User Data Response: {{ userDataState }}</p>
    <h2>Update User Data</h2>
    <input placeholder="First Name" v-model="firstNameUpdateInput" />
    <input placeholder="Last Name" v-model="lastNameUpdateInput" />
    <input placeholder="Email" v-model="emailUpdateInput" />
    <input placeholder="Username" v-model="usernameUpdateInput" />
    <input placeholder="Profile" type="file" accept="image/*" @change="handleUpdateProfileChange" />
    <input placeholder="Description" v-model="descriptionUpdateInput" />
    <button @click="handleUpdateUserDataClick">Update</button>
    <p>Update User Data Response: {{ updateUserDataState }}</p>
    <h2>Invites</h2>
    <button @click="handleUserInvitesClick">Get Invites</button>
    <p>User Invites Response: {{ userInvitesState }}</p>
    <h2>Invite User</h2>
    <input placeholder="User" v-model="inviteUserInput" />
    <button @click="handleInviteUserClick">Invite</button>
    <p>Invite User Response: {{ inviteUserState }}</p>
    <h2>Invite Respond</h2>
    <input placeholder="User" v-model="inviteResponseUserInput" />
    <p>Response</p>
    <select v-model="inviteResponseInput">
      <option value="ACCEPT">ACCEPT</option>
      <option value="DECLINE">DECLINE</option>
    </select>
    <button @click="handleInputResponseClick">Respond</button>
    <p>Invite Response Response: {{ inviteResponseState }}</p>
    <h2>Invited Users</h2>
    <button @click="handleInvitedUsersClick">Get Invited</button>
    <p>Invited Users Response: {{ invitedUsersState }}</p>
    <h2>Friends</h2>
    <button @click="handleUserFriendsClick">Get Friends</button>
    <p>User Friends Response: {{ userFriendsState }}</p>
    <h2>Chat</h2>
    <i style="color: red">Note: User Data first needs to be fetched!</i><br />
    <input placeholder="User" v-model="userChatUserInput" />
    <button @click="handleUserChatClick">Get Chat</button>
    <p>User Chat Response: {{ userChatState }}</p>
    <h2>Send Message</h2>
    <i style="color: red">Note: Friends Chat first needs to be fetched!</i><br />
    <input placeholder="User" v-model="sendMessageUserInput" />
    <input placeholder="Message" v-model="sendMessageMessageInput" />
    <button @click="handleSendMessageClick">Send</button>
    <p>Send Message Response: {{ sendMessageState }}</p>
    <h2>Block User</h2>
    <p>- CANCELED -</p>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import store from '../store/index';
import { readImageFile, ReadImageFileCallbackType } from '../utlis/functions.util';
import { InviteResponseEnumFromString, InviteResponseEnum } from '../services/types/request.type';

export default defineComponent({
  name: 'Test',
  setup() {
    // Store Actions
    const register = (
      firstName: string,
      lastName: string,
      username: string,
      password: string,
      passwordVerification: string,
      email: string,
    ) => {
      if (password !== passwordVerification) {
        alert("Passwords weren't the same!");
        return;
      }
      store.dispatch('account/postRegisterUser', {
        firstName,
        lastName,
        username,
        password,
        email,
      });
    };
    const verify = (code: string) => {
      store.dispatch('account/postVerifyEmail', {
        code,
      });
    };
    const login = (user: string, password: string) => {
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The user is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('account/postLogin', {
        username,
        userTag,
        password,
      });
    };
    const refresh = () => store.dispatch('account/postRefresh');
    const logout = () => store.dispatch('account/postLogout');
    const resetPassword = (user: string) => {
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The username is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('account/postResetPassword', {
        username,
        userTag,
      });
    };
    const changePassword = (code: string, password: string, passwordVerification: string) => {
      if (password !== passwordVerification) {
        alert("Passwords weren't the same!");
        return;
      }
      store.dispatch('account/postChangePassword', {
        code,
        password,
      });
    };
    const userData = () => store.dispatch('user/fetchUserData');
    const updateUserData = (
      firstName: string,
      lastName: string,
      email: string,
      username: string,
      profile: string | null,
      description: string,
    ) => store.dispatch('user/postUpdateUserData', {
      ...(firstName !== '' && { first_name: firstName }),
      ...(lastName !== '' && { last_name: lastName }),
      ...(email !== '' && { email }),
      ...(username !== '' && { username }),
      ...(profile !== '' && profile !== null && { profile }),
      ...(description !== '' && { description }),
    });
    const inviteUser = (user: string) => {
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The user is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('user/postUserInvite', {
        username,
        userTag,
      });
    };
    const inviteResponse = (user: string, response: InviteResponseEnum | null) => {
      if (!response) {
        alert('Please provide an invite answer');
      }
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The user is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('user/postInviteResponse', {
        username,
        userTag,
        response,
      });
    };
    const userChat = (user: string) => {
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The user is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('user/fetchUserChat', {
        username,
        userTag,
      });
    };
    const sendMessage = (user: string, message: string) => {
      const userList = user.split('#');
      if (userList.length !== 2) {
        alert("The user is invalid! (provide '#')");
        return;
      }
      const username: string = userList[0];
      const userTag: number = parseInt(userList[1], 10);
      store.dispatch('user/postSendMessage', {
        username,
        userTag,
        message,
      });
    };

    // Basic Data
    const firstNameInput = ref('');
    const lastNameInput = ref('');
    const usernameRegisterInput = ref('');
    const passwordRegisterInput = ref('');
    const passwordVerificationRegisterInput = ref('');
    const emailInput = ref('');
    const emailVerificationCodeInput = ref('');
    const userLoginInput = ref('');
    const passwordLoginInput = ref('');
    const usernameResetPasswordInput = ref('');
    const passwordVerificationCodeInput = ref('');
    const passwordResetInput = ref('');
    const passwordVerificationResetInput = ref('');
    const firstNameUpdateInput = ref('');
    const lastNameUpdateInput = ref('');
    const emailUpdateInput = ref('');
    const usernameUpdateInput = ref('');
    const profileUpdateInput = ref('');
    const descriptionUpdateInput = ref('');
    const inviteUserInput = ref('');
    const inviteResponseUserInput = ref('');
    const inviteResponseInput = ref('');
    const userChatUserInput = ref('');
    const sendMessageUserInput = ref('');
    const sendMessageMessageInput = ref('');

    // Click Handler
    const handleRegisterUserClick = () => register(
      firstNameInput.value,
      lastNameInput.value,
      usernameRegisterInput.value,
      passwordRegisterInput.value,
      passwordVerificationRegisterInput.value,
      emailInput.value,
    );
    const handleVerifyEmailClick = () => verify(emailVerificationCodeInput.value);
    const handleLoginClick = () => login(userLoginInput.value, passwordLoginInput.value);
    const handleRefreshClick = () => refresh();
    const handleLogoutClick = () => logout();
    const handleResetPasswordClick = () => resetPassword(usernameResetPasswordInput.value);
    const handleChangePasswordClick = () => changePassword(
      passwordVerificationCodeInput.value,
      passwordResetInput.value,
      passwordVerificationResetInput.value,
    );
    const handleGetUserDataClick = () => userData();
    const handleUpdateUserDataClick = () => updateUserData(
      firstNameUpdateInput.value,
      lastNameUpdateInput.value,
      emailUpdateInput.value,
      usernameUpdateInput.value,
      profileUpdateInput.value,
      descriptionUpdateInput.value,
    );
    const handleUpdateProfileChange = (event: any) => {
      const [file] = event.target.files;
      const imageCallback: ReadImageFileCallbackType = (content: string) => {
        profileUpdateInput.value = content;
      };
      readImageFile(file, imageCallback);
    };
    const handleUserInvitesClick = () => store.dispatch('user/fetchUserInvites');
    const handleInviteUserClick = () => inviteUser(inviteUserInput.value);
    const handleInputResponseClick = () => inviteResponse(
      inviteResponseUserInput.value,
      InviteResponseEnumFromString(inviteResponseInput.value),
    );
    const handleInvitedUsersClick = () => store.dispatch('user/fetchInvitedUsers');
    const handleUserFriendsClick = () => store.dispatch('user/fetchUserFriends');
    const handleUserChatClick = () => userChat(userChatUserInput.value);
    const handleSendMessageClick = () => sendMessage(sendMessageUserInput.value, sendMessageMessageInput.value);

    // Store Computed
    const regiserUserState = computed(() => store.getters['account/getRegisterUserRequest']);
    const verifyEmailState = computed(() => store.getters['account/getVerifyEmailRequest']);
    const loginState = computed(() => store.getters['account/getLoginRequest']);
    const refreshState = computed(() => store.getters['account/getRefreshRequest']);
    const logoutState = computed(() => store.getters['account/getLogoutRequest']);
    const resetPasswordStatus = computed(() => store.getters['account/getResetPasswordRequest']);
    const changePasswordState = computed(() => store.getters['account/getChangePasswordRequest']);
    const userDataState = computed(() => store.getters['user/getUserDataRequest']);
    const updateUserDataState = computed(() => store.getters['user/getUpdateUserDataRequest']);
    const userInvitesState = computed(() => store.getters['user/getUserInvitesRequest']);
    const inviteUserState = computed(() => store.getters['user/getUserInviteRequest']);
    const inviteResponseState = computed(() => store.getters['user/getInviteResponseRequest']);
    const invitedUsersState = computed(() => store.getters['user/getInvitedUsersRequest']);
    const userFriendsState = computed(() => store.getters['user/getUserFriendsRequest']);
    const userChatState = computed(() => store.getters['user/getUserChatRequestDecrypted']);
    const sendMessageState = computed(() => store.getters['user/getSendMessageRequest']);

    return {
      // events
      handleRegisterUserClick,
      handleVerifyEmailClick,
      handleLoginClick,
      handleRefreshClick,
      handleLogoutClick,
      handleResetPasswordClick,
      handleChangePasswordClick,
      handleGetUserDataClick,
      handleUpdateUserDataClick,
      handleUserInvitesClick,
      handleUpdateProfileChange,
      handleInviteUserClick,
      handleInputResponseClick,
      handleInvitedUsersClick,
      handleUserFriendsClick,
      handleUserChatClick,
      handleSendMessageClick,
      // input refs
      firstNameInput,
      lastNameInput,
      usernameRegisterInput,
      userLoginInput,
      passwordRegisterInput,
      passwordLoginInput,
      passwordVerificationRegisterInput,
      emailInput,
      emailVerificationCodeInput,
      usernameResetPasswordInput,
      passwordVerificationCodeInput,
      passwordResetInput,
      passwordVerificationResetInput,
      firstNameUpdateInput,
      lastNameUpdateInput,
      emailUpdateInput,
      usernameUpdateInput,
      descriptionUpdateInput,
      inviteUserInput,
      inviteResponseUserInput,
      inviteResponseInput,
      userChatUserInput,
      sendMessageUserInput,
      sendMessageMessageInput,
      // computed states
      regiserUserState,
      verifyEmailState,
      loginState,
      refreshState,
      logoutState,
      resetPasswordStatus,
      changePasswordState,
      userDataState,
      updateUserDataState,
      userInvitesState,
      inviteUserState,
      inviteResponseState,
      invitedUsersState,
      userFriendsState,
      userChatState,
      sendMessageState,
    };
  },
});
</script>
