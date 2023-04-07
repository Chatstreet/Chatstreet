import { getCookieByName } from '@/utlis/cookie.util';
import { post, get } from './instance.service';
import { Response } from './response.type';
import {
  InviteResponseEnum,
  InviteUserRequestType,
  UpdateUserDataRequestType,
} from './request.type';

// POST
const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
): Promise<Response> => {
  const result: Response = await post('/token/register')
    .request({
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        email,
      },
    })
    .then((response: Response) => response);
  return result;
};

const verifyEmail = async (code: string): Promise<Response> => {
  const result: Response = await post('/account/verification')
    .request({
      data: {
        code,
      },
    })
    .then((response: Response) => response);
  return result;
};

const login = async (username: string, userTag: string, password: string): Promise<Response> => {
  const result: Response = await post('/token/auth')
    .request({
      data: {
        username,
        user_tag: userTag,
        password,
      },
    })
    .then((response: Response) => response);
  return result;
};

const refresh = async (): Promise<Response> => {
  const result: Response = await post('/token/refresh')
    .request({
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_refresh_token'),
      },
    })
    .then((response: Response) => response);
  return result;
};

const logout = async (): Promise<Response> => {
  const result: Response = await post('/token/remove')
    .request({})
    .then((response: Response) => response);
  return result;
};

const resetPassword = async (username: string, user_tag: string): Promise<Response> => {
  const result: Response = await post('/account/reset/code')
    .request({
      data: {
        username,
        user_tag,
      },
    })
    .then((response: Response) => response);
  return result;
};

const changePassword = async (code: string, password: string): Promise<Response> => {
  const result: Response = await post('/account/reset/password')
    .request({
      data: {
        code,
        password,
      },
    })
    .then((response: Response) => response);
  return result;
};

const updateUserData = async (data: UpdateUserDataRequestType): Promise<Response> => {
  const result: Response = await post('/api/user/data')
    .request({
      data,
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((response: Response) => response);
  return result;
};

const inviteUser = async (username: string, user_tag: number): Promise<Response> => {
  const result: Response = await post('/api/user/invites')
    .request({
      data: {
        username,
        user_tag,
      },
      headers: {
        'X-CSRF-TOKEN': getCookieByName('csrf_access_token'),
      },
    })
    .then((response: Response) => response);
  return result;
};

const inviteResponse = async (
  contact_username: string,
  contact_user_tag: number,
  response: InviteResponseEnum,
): Promise<Response> => {
  const result: Response = await post('/api/user/invite/respond')
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
    .then((res: Response) => res);
  return result;
};

const sendMessage = async (
  contact_username: string,
  contact_user_tag: number,
  sender_message: string,
  reciever_message: string,
): Promise<Response> => {
  const result: Response = await post('/api/user/chat')
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
    .then((response: Response) => response);
  return result;
};

// GET

const userData = async (): Promise<Response> => {
  const result: Response = await get('/api/user/data')
    .request({})
    .then((response: Response) => response);
  return result;
};

const userInvites = async (): Promise<Response> => {
  const result: Response = await get('/api/user/invites')
    .request({})
    .then((response: Response) => response);
  return result;
};

const invitedUsers = async (): Promise<Response> => {
  const result: Response = await get('/api/user/invited')
    .request({})
    .then((response: Response) => response);
  return result;
};

const userFriends = async (): Promise<Response> => {
  const result: Response = await get('/api/user/friends')
    .request({})
    .then((response: Response) => response);
  return result;
};

// Non standart implementation. Open backend Issue.
const userChat = async (username: string, user_tag: number): Promise<Response> => {
  const result: Response = await get(`/api/user/chat?friend=${username}%23${user_tag}`)
    .request({})
    .then((response: Response) => response);
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
