type PlaybookNamesType =
  | 'VALIDATE_USER_AUTHENTICATION_STATE'
  | 'USER_AUTHENTICATION'
  | 'ACCOUNT_RESET_PASSWORD'
  | 'USER_REGISTRATION'
  | 'USER_DATA_UPDATE'
  | 'USER_INVITE_USER'
  | 'USER_INVITATION_RESPONSE';

interface IPlaybook<T> {
  start(data: any): Promise<T>;
  getPlaybookName(): PlaybookNamesType;
  notify(): void;
}

type PlaybookReturnType<T> = T extends 'VALIDATE_USER_AUTHENTICATION_STATE'
  ? boolean
  : T extends
      | 'USER_AUTHENTICATION'
      | 'USER_INVITATION_RESPONSE'
      | 'ACCOUNT_RESET_PASSWORD'
      | 'USER_REGISTRATION'
      | 'USER_DATA_UPDATE'
      | 'USER_INVITE_USER'
  ? string
  : never;

export { IPlaybook, PlaybookNamesType, PlaybookReturnType };
