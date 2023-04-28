import { StoreRequestResultType, CommitFunction } from '@/store/types/store.type';
import { Module } from 'vuex';
import typeOrNull from '@/type-guards/serialize';

import {
  UpdateUserDataResponseType,
  FetchUserDataResponseType,
  FetchUserInvitesResponseType,
  UserInviteResponseType,
  InviteResponseResponseType,
  FetchInvitedUsersResponseType,
  FetchUserFriendsResponseType,
  FetchUserChatResponseType,
  UserMessageResponseType,
  UserMessageType,
  ErrorResponseType,
  RequestResponseType,
} from '@/services/types/response.type';

import {
  UpdateUserDataRequestType,
  InviteUserRequestType,
  InviteResponseRequestType,
  UserChatRequestType,
  SendMessageRequestType,
} from '@/services/types/request.type';

import {
  updateUserData,
  userData,
  userInvites,
  inviteUser,
  inviteResponse,
  invitedUsers,
  userFriends,
  userChat,
  sendMessage,
} from '@/services/request.service';
import { encryptText, decryptText } from '@/utlis/encryption.util';

export interface UserState {
  updateUserDataRequest?: StoreRequestResultType;
  userDataRequest?: StoreRequestResultType;
  userInvitesRequest?: StoreRequestResultType;
  userInviteRequest?: StoreRequestResultType;
  inviteResponseRequest?: StoreRequestResultType;
  invitedUsersRequest?: StoreRequestResultType;
  userFriendsRequest?: StoreRequestResultType;
  userChatRequest?: StoreRequestResultType;
  sendMessageRequest?: StoreRequestResultType;
}

const UserStoreModule: Module<UserState, any> = {
  namespaced: true,
  getters: {
    getUpdateUserDataRequest: (state: UserState) => state.updateUserDataRequest ?? {},
    getUserDataRequest: (state: UserState) => state.userDataRequest ?? {},
    getUserInvitesRequest: (state: UserState) => state.userInvitesRequest ?? {},
    getUserInvitesRequestResult: (state: UserState) => state.userInvitesRequest?.result ?? {},
    getUserInviteRequest: (state: UserState) => state.userInviteRequest ?? {},
    getInviteResponseRequest: (state: UserState) => state.inviteResponseRequest ?? {},
    getInvitedUsersRequest: (state: UserState) => state.invitedUsersRequest ?? {},
    getInvitedUsersRequestResult: (state: UserState) => state.invitedUsersRequest?.result ?? {},
    getUserFriendsRequest: (state: UserState) => state.userFriendsRequest ?? {},
    getUserChatRequest: (state: UserState) => state.userChatRequest ?? {},
    // user data is mandatory for this call
    getUserChatRequestDecrypted: (state: UserState) => {
      if (!state.userChatRequest?.result || !state.userDataRequest?.result) return { msg: 'user chat data or user data returned undefined' };
      const user: FetchUserDataResponseType | null = typeOrNull<FetchUserDataResponseType>(
        state.userDataRequest.result,
        'user-data',
      );
      if (!user) return { msg: 'type serialization of user data returned null' };
      const privateKey: string | null = user.user.private_key;
      const userChatSerialized: FetchUserChatResponseType | null = typeOrNull<FetchUserChatResponseType>(state.userChatRequest.result, 'user-chat');
      if (!userChatSerialized || !userChatSerialized.chat) return { msg: 'type serialization of user chat returned null' };
      const userMessagesDecrypted: UserMessageType[] = userChatSerialized.chat.messages.map(
        (message: UserMessageType) => {
          if (message.user === `${user.user.username}#${user.user.user_tag}`) {
            return {
              ...message,
              decoded: decryptText(message.sender_content, privateKey).toString(),
            };
          }
          return {
            ...message,
            decoded: decryptText(message.reciever_content, privateKey).toString(),
          };
        },
      );
      return {
        ...state.userChatRequest,
        result: {
          ...state.userChatRequest.result,
          messages: userMessagesDecrypted,
        },
      };
    },
    getSendMessageRequest: (state: UserState) => state.sendMessageRequest ?? {},
  },
  mutations: {
    UPDATE_USER_DATA_REQUEST_START(state: UserState) {
      state.updateUserDataRequest = {
        status: 'PENDING',
      };
    },
    UPDATE_USER_DATA_REQUEST_SUCCESS(state: UserState, result: UpdateUserDataResponseType) {
      state.updateUserDataRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    UPDATE_USER_DATA_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.updateUserDataRequest = {
        status: 'ERROR',
        error,
      };
    },
    USER_DATA_REQUEST_START(state: UserState) {
      state.userDataRequest = {
        status: 'PENDING',
        ...state.userDataRequest,
      };
    },
    USER_DATA_REQUEST_SUCCESS(state: UserState, result: FetchUserDataResponseType) {
      state.userDataRequest = {
        status: 'SUCCESS',
        result: {
          ...result,
          name: 'user-data',
        },
      };
    },
    USER_DATA_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.userDataRequest = {
        status: 'ERROR',
        error,
      };
    },
    USER_INVITES_REQUEST_START(state: UserState) {
      state.userInvitesRequest = {
        status: 'PENDING',
        ...state.userInvitesRequest,
      };
    },
    USER_INVITES_REQUEST_SUCCESS(state: UserState, result: FetchUserInvitesResponseType) {
      state.userInvitesRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    USER_INVITES_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.userInvitesRequest = {
        status: 'ERROR',
        error,
      };
    },
    USER_INVITE_REQUEST_START(state: UserState) {
      state.userInviteRequest = {
        status: 'PENDING',
      };
    },
    USER_INVITE_REQUEST_SUCCESS(state: UserState, result: UserInviteResponseType) {
      state.userInviteRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    USER_INVITE_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.userInviteRequest = {
        status: 'ERROR',
        error,
      };
    },
    INVITE_RESPONSE_REQUEST_START(state: UserState) {
      state.inviteResponseRequest = {
        status: 'PENDING',
      };
    },
    INVITE_RESPONSE_REQUEST_SUCCESS(state: UserState, result: InviteResponseResponseType) {
      state.inviteResponseRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    INVITE_RESPONSE_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.inviteResponseRequest = {
        status: 'ERROR',
        error,
      };
    },
    INVITED_USERS_REQUEST_START(state: UserState) {
      state.invitedUsersRequest = {
        status: 'PENDING',
        ...state.invitedUsersRequest,
      };
    },
    INVITED_USERS_REQUEST_SUCCESS(state: UserState, result: FetchInvitedUsersResponseType) {
      state.invitedUsersRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    INVITED_USERS_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.invitedUsersRequest = {
        status: 'ERROR',
        error,
      };
    },
    USER_FRIENDS_REQUEST_START(state: UserState) {
      state.userFriendsRequest = {
        status: 'PENDING',
      };
    },
    USER_FRIENDS_REQUEST_SUCCESS(state: UserState, result: FetchUserFriendsResponseType) {
      state.userFriendsRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    USER_FRIENDS_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.userFriendsRequest = {
        status: 'ERROR',
        error,
      };
    },
    USER_CHAT_REQUEST_START(state: UserState) {
      state.userChatRequest = {
        status: 'PENDING',
      };
    },
    USER_CHAT_REQUEST_SUCCESS(state: UserState, result: FetchUserChatResponseType) {
      state.userChatRequest = {
        status: 'SUCCESS',
        result: {
          ...result,
          name: 'user-chat',
        },
      };
    },
    USER_CHAT_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.userChatRequest = {
        status: 'ERROR',
        error,
      };
    },
    SEND_MESSAGE_REQUEST_START(state: UserState) {
      state.sendMessageRequest = {
        status: 'PENDING',
      };
    },
    SEND_MESSAGE_REQUEST_SUCCESS(state: UserState, result: UserMessageResponseType) {
      state.sendMessageRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    SEND_MESSAGE_REQUEST_ERROR(state: UserState, error: ErrorResponseType) {
      state.sendMessageRequest = {
        status: 'ERROR',
        error,
      };
    },
  },
  actions: {
    async postUpdateUserData({ commit }: CommitFunction, input: UpdateUserDataRequestType) {
      commit('UPDATE_USER_DATA_REQUEST_START');
      await updateUserData(input)
        .then((response: RequestResponseType<UpdateUserDataResponseType>) => {
          if (response[1] !== 200) {
            commit('UPDATE_USER_DATA_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('UPDATE_USER_DATA_REQUEST_SUCCESS', response[0]);
          }
        })
        .catch((error) => {
          commit('UPDATE_USER_DATA_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async fetchUserData({ commit }: CommitFunction) {
      commit('USER_DATA_REQUEST_START');
      await userData()
        .then((response: RequestResponseType<FetchUserDataResponseType>) => {
          if (response[1] !== 200) {
            commit('USER_DATA_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('USER_DATA_REQUEST_SUCCESS', response[0]);
          }
        })
        .catch((error) => {
          commit('USER_DATA_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    fetchUserInvites({ commit }: CommitFunction) {
      commit('USER_INVITES_REQUEST_START');
      userInvites()
        .then((response: FetchUserInvitesResponseType) => commit('USER_INVITES_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('USER_INVITES_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async postUserInvite({ commit }: CommitFunction, input: InviteUserRequestType) {
      commit('USER_INVITE_REQUEST_START');
      await inviteUser(input.username, input.userTag)
        .then((response: RequestResponseType<UserInviteResponseType>) => {
          if (response[1] !== 200) {
            commit('USER_INVITE_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('USER_INVITE_REQUEST_SUCCESS', response[0]);
          }
        })
        .catch((error) => {
          commit('USER_INVITE_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async postInviteResponse({ commit }: CommitFunction, input: InviteResponseRequestType) {
      commit('INVITE_RESPONSE_REQUEST_START');
      await inviteResponse(input.username, input.userTag, input.response)
        .then((response: RequestResponseType<InviteResponseResponseType>) => {
          if (response[1] !== 200) {
            commit('INVITE_RESPONSE_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('INVITE_RESPONSE_REQUEST_SUCCESS', response[0]);
          }
        })
        .catch((error) => {
          commit('INVITE_RESPONSE_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    fetchInvitedUsers({ commit }: CommitFunction) {
      commit('INVITED_USERS_REQUEST_START');
      invitedUsers()
        .then((response: FetchInvitedUsersResponseType) => commit('INVITED_USERS_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('INVITED_USERS_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    fetchUserFriends({ commit }: CommitFunction) {
      commit('USER_FRIENDS_REQUEST_START');
      userFriends()
        .then((response: FetchUserFriendsResponseType) => commit('USER_FRIENDS_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('USER_FRIENDS_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    fetchUserChat({ commit }: CommitFunction, input: UserChatRequestType) {
      commit('USER_CHAT_REQUEST_START');
      userChat(input.username, input.userTag)
        .then((response: FetchUserChatResponseType) => commit('USER_CHAT_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('USER_CHAT_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    postSendMessage({ commit, getters }, input: SendMessageRequestType) {
      const chat: StoreRequestResultType | undefined = getters.getUserChatRequest;
      const data: StoreRequestResultType | undefined = getters.getUserDataRequest;
      if (!chat || !chat.result || !data || !data.result) return;
      const userChatSerialized: FetchUserChatResponseType | null = typeOrNull<FetchUserChatResponseType>(chat.result, 'user-chat');
      const userDataSerialized: FetchUserDataResponseType | null = typeOrNull<FetchUserDataResponseType>(data.result, 'user-data');
      if (
        !userChatSerialized
        || !userChatSerialized.chat
        || !userDataSerialized
        || !userDataSerialized.user
      ) return;
      const publicKeyReciever = userChatSerialized.chat.public_key;
      const publicKeySender = userDataSerialized.user.public_key;
      const encryptedMessageReciever: string | false = encryptText(
        input.message,
        publicKeyReciever,
      );
      const encryptedMessageSender: string | false = encryptText(input.message, publicKeySender);
      if (!encryptedMessageReciever || !encryptedMessageSender) return;
      commit('SEND_MESSAGE_REQUEST_START');
      sendMessage(input.username, input.userTag, encryptedMessageSender, encryptedMessageReciever)
        .then((response: UserMessageResponseType) => commit('SEND_MESSAGE_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('SEND_MESSAGE_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
  },
};

export default UserStoreModule;
