interface AuthenticationUserDataDatabaseResponse {
  password: string;
  email: string;
  username: string;
  tag: number;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AvailableTagDatabaseResponse {
  tag: number;
}

export { AuthenticationUserDataDatabaseResponse, AvailableTagDatabaseResponse };
