interface AuthenticationUserDataSelectionQueryInput {
  email: string | null;
  username: string | null;
  tag: number | null;
}

interface RegistrationUserDataInsertionQueryInput {
  username: string;
  tag: number;
  firstName: string;
  lastName: string;
  email: string;
  recoveryEmail: string | null;
  phoneNumber: string | null;
  birthdate: Date | null;
  spicyPassword: string;
}

interface JsonWebTokenHashInsertionQueryInput {
  userId: number;
  jsonWebTokenHash: string;
}

interface UserIdSelectionQueryInput {
  email: string | null;
  username: string | null;
  tag: number | null;
}

export {
  AuthenticationUserDataSelectionQueryInput,
  RegistrationUserDataInsertionQueryInput,
  JsonWebTokenHashInsertionQueryInput,
  UserIdSelectionQueryInput,
};
