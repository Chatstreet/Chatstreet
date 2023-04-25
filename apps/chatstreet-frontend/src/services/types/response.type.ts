type ErrorResponseType = {
  code: 400 | 401 | 404 | 500;
  msg: string;
};

type RequestResponseType<T> = {
  0: T;
  1: 400 | 401 | 404 | 500 | 200;
};

type RegisterUserResponeType = {
  name: 'register-user';
  register: boolean;
  verification_sent?: boolean;
  user_tag?: number;
  unset_params?: unknown;
  msg?: string;
};

type VerifyEmailResponseType = {
  name: 'verify-email';
  verification: boolean;
  msg?: string;
};

type LoginResponseType = {
  name: 'login';
  login: boolean;
  msg?: string;
};

type RefreshResponseType = {
  name: 'refresh';
  refresh: boolean;
  msg?: string;
};

type LogoutResponseType = {
  name: 'logout';
  logout: boolean;
  msg?: string;
};

type ResetPasswordResponseType = {
  name: 'reset-password';
  reset_request: boolean;
  msg?: string;
};

type ChangePasswordResponseType = {
  name: 'change-password';
  reset_password: boolean;
  msg?: string;
};

type UpdateUserDataResponseType = {
  name: 'update-user-data';
  update: boolean;
  msg?: string;
};

type UserDataType = {
  username: string;
  user_tag: number;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  profile: string;
  private_key: string;
  public_key: string;
};

type FetchUserDataResponseType = {
  name: 'user-data';
  user: UserDataType;
  msg?: string;
};

type UserInviteType = {
  user: string;
  username: string;
  tag: number;
};

type FetchUserInvitesResponseType = {
  name: 'user-invites';
  invite: boolean;
  invites?: UserInviteType[];
  msg?: string;
};

type UserInviteResponseType = {
  name: 'user-invite';
  invite: boolean;
  msg?: string;
};

type InviteResponseResponseType = {
  name: 'invite-response';
  invite_response: boolean;
  msg?: string;
};

type FetchInvitedUsersResponseType = {
  name: 'invited-users';
  invited: UserInviteType[];
  msg?: string;
};

type FetchUserFriendsResponseType = {
  name: 'user-friends';
  friends: UserInviteType[];
  msg?: string;
};

type UserMessageType = {
  sender_content: string;
  reciever_content: string;
  user: string;
  timestamp: number;
};

type UserChatType = {
  status: boolean;
  messages: UserMessageType[];
  friend: string;
  public_key: string;
};

type FetchUserChatResponseType = {
  name: 'user-chat';
  status: boolean;
  chat?: UserChatType;
  msg?: string;
};

type UserMessageResponseType = {
  status: boolean;
  msg?: string;
};

type ResponseTypesEnums =
  | RegisterUserResponeType
  | VerifyEmailResponseType
  | LoginResponseType
  | RefreshResponseType
  | LogoutResponseType
  | ResetPasswordResponseType
  | ChangePasswordResponseType
  | UpdateUserDataResponseType
  | FetchUserDataResponseType
  | FetchUserInvitesResponseType
  | UserInviteResponseType
  | InviteResponseResponseType
  | FetchInvitedUsersResponseType
  | FetchUserFriendsResponseType
  | FetchUserChatResponseType
  | UserMessageResponseType;

export {
  ErrorResponseType,
  ResponseTypesEnums,
  VerifyEmailResponseType,
  RegisterUserResponeType,
  LoginResponseType,
  RefreshResponseType,
  LogoutResponseType,
  ResetPasswordResponseType,
  ChangePasswordResponseType,
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
  RequestResponseType,
};
