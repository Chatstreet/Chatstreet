type RegisterUserRequestType = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
};

type VerifyEmailRequestType = {
  code: string;
};

type LoginRequestType = {
  username: string;
  userTag: string;
  password: string;
};

type ResetPasswordRequestType = {
  username: string;
  userTag: string;
};

type ChangePasswordRequestType = {
  code: string;
  password: string;
};

type UpdateUserDataRequestType = {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  profile?: string;
  description?: string;
};

type InviteUserRequestType = {
  username: string;
  userTag: number;
};

type UserChatRequestType = InviteUserRequestType;

enum InviteResponseEnum {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

function InviteResponseEnumFromString(string: string): InviteResponseEnum | null {
  switch (string) {
    case InviteResponseEnum.ACCEPT: {
      return InviteResponseEnum.ACCEPT;
    }
    case InviteResponseEnum.DECLINE: {
      return InviteResponseEnum.DECLINE;
    }
    default: {
      return null;
    }
  }
}

type InviteResponseRequestType = {
  username: string;
  userTag: number;
  response: InviteResponseEnum;
};

type SendMessageRequestType = {
  username: string;
  userTag: number;
  message: string;
};

export {
  RegisterUserRequestType,
  VerifyEmailRequestType,
  LoginRequestType,
  ResetPasswordRequestType,
  ChangePasswordRequestType,
  UpdateUserDataRequestType,
  InviteUserRequestType,
  InviteResponseEnum,
  InviteResponseRequestType,
  UserChatRequestType,
  SendMessageRequestType,
  InviteResponseEnumFromString,
};
