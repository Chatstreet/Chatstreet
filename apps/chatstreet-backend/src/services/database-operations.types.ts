interface AuthenticationUserDataDatabaseResponse {
  password: string;
  email: string;
  username: string;
  tag: number;
}

interface AvailableTagDatabaseResponse {
  tag: number;
}

export { AuthenticationUserDataDatabaseResponse, AvailableTagDatabaseResponse };
