type PlaybookNamesType =
  | 'VALIDATE_USER_AUTHENTICATION_STATE'
  | 'USER_AUTHENTICATION'
  | 'ACCOUNT_RESET_PASSWORD'
  | 'USER_REGISTRATION';

interface IPlaybook<T> {
  start(data: any): Promise<T>;
  getPlaybookName(): PlaybookNamesType;
  notify(): void;
}

type PlaybookReturnType<T> = T extends 'VALIDATE_USER_AUTHENTICATION_STATE'
  ? boolean
  : T extends 'USER_AUTHENTICATION'
  ? string
  : T extends 'ACCOUNT_RESET_PASSWORD'
  ? string
  : T extends 'USER_REGISTRATION'
  ? string
  : never;

export { IPlaybook, PlaybookNamesType, PlaybookReturnType };
