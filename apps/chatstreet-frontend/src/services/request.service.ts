import { getCookieByName } from '@/utlis/cookie.util';
import { AxiosResponse } from 'axios';
import { post, get } from './instance.service';
import { InviteResponseEnum, UpdateUserDataRequestType } from './types/request.type';
import {
  RegisterUserResponeType,
  VerifyEmailResponseType,
  LoginResponseType,
  RefreshResponseType,
  UserMessageResponseType,
  FetchUserChatResponseType,
  FetchUserFriendsResponseType,
  FetchInvitedUsersResponseType,
  FetchUserInvitesResponseType,
  FetchUserDataResponseType,
  LogoutResponseType,
  ResetPasswordResponseType,
  ChangePasswordResponseType,
  UpdateUserDataResponseType,
  UserInviteResponseType,
  InviteResponseResponseType,
  RequestResponseType,
} from './types/response.type';

// POST
const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
): Promise<RegisterUserResponeType> => {
  const result: RegisterUserResponeType = await post('/token/register')
    .request({
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        email,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const verifyEmail = async (code: string): Promise<RequestResponseType<VerifyEmailResponseType>> => {
  const result: RequestResponseType<VerifyEmailResponseType> = await post('/account/verification')
    .request({
      data: {
        code,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const login = async (
  username: string,
  userTag: string,
  password: string,
): Promise<RequestResponseType<LoginResponseType>> => {
  const result: RequestResponseType<LoginResponseType> = await post('/token/auth')
    .request({
      data: {
        username,
        user_tag: userTag,
        password,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const refresh = async (): Promise<RefreshResponseType> => {
  const result: RefreshResponseType = await post('/token/refresh')
    .request({
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_refresh_token'),
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const logout = async (): Promise<LogoutResponseType> => {
  const result: LogoutResponseType = await post('/token/remove')
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const resetPassword = async (
  username: string,
  user_tag: string,
): Promise<ResetPasswordResponseType> => {
  const result: ResetPasswordResponseType = await post('/account/reset/code')
    .request({
      data: {
        username,
        user_tag,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const changePassword = async (
  code: string,
  password: string,
): Promise<ChangePasswordResponseType> => {
  const result: ChangePasswordResponseType = await post('/account/reset/password')
    .request({
      data: {
        code,
        password,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const updateUserData = async (
  data: UpdateUserDataRequestType,
): Promise<UpdateUserDataResponseType> => {
  const result: UpdateUserDataResponseType = await post('/api/user/data')
    .request({
      data,
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const inviteUser = async (username: string, user_tag: number): Promise<UserInviteResponseType> => {
  const result: UserInviteResponseType = await post('/api/user/invites')
    .request({
      data: {
        username,
        user_tag,
      },
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const inviteResponse = async (
  contact_username: string,
  contact_user_tag: number,
  response: InviteResponseEnum,
): Promise<InviteResponseResponseType> => {
  const result: InviteResponseResponseType = await post('/api/user/invite/respond')
    .request({
      data: {
        contact_username,
        contact_user_tag,
        response,
      },
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((res: AxiosResponse<any, any>) => res.data);
  return result;
};

const sendMessage = async (
  contact_username: string,
  contact_user_tag: number,
  sender_message: string,
  reciever_message: string,
): Promise<UserMessageResponseType> => {
  const result: UserMessageResponseType = await post('/api/user/chat')
    .request({
      data: {
        contact_username,
        contact_user_tag,
        sender_message,
        reciever_message,
      },
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

// GET

const userData = async (): Promise<FetchUserDataResponseType> => {
  const result: FetchUserDataResponseType = await get('/api/user/data')
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const userInvites = async (): Promise<FetchUserInvitesResponseType> => {
  const result: FetchUserInvitesResponseType = await get('/api/user/invites')
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const invitedUsers = async (): Promise<FetchInvitedUsersResponseType> => {
  const result: FetchInvitedUsersResponseType = await get('/api/user/invited')
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

const userFriends = async (): Promise<FetchUserFriendsResponseType> => {
  const result: FetchUserFriendsResponseType = await get('/api/user/friends')
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

// Non standart implementation. Open backend Issue.
const userChat = async (username: string, user_tag: number): Promise<FetchUserChatResponseType> => {
  const result: FetchUserChatResponseType = await get(
    `/api/user/chat?friend=${username}%23${user_tag}`,
  )
    .request({})
    .then((response: AxiosResponse<any, any>) => response.data);
  return result;
};

export {
  registerUser,
  verifyEmail,
  login,
  refresh,
  logout,
  resetPassword,
  changePassword,
  updateUserData,
  userData,
  userInvites,
  inviteUser,
  inviteResponse,
  invitedUsers,
  userFriends,
  userChat,
  sendMessage,
};
