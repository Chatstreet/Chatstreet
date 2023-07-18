interface AuthenticationUserDataDatabaseResponse {
  password: string;
}

interface AvailableTagDatabaseResponse {
  tag: number;
}

interface UserIdDatabaseResponse {
  user_id: number;
}

interface RemovalDatabaseResponse {
  affectedRows: number;
}

export {
  AuthenticationUserDataDatabaseResponse,
  AvailableTagDatabaseResponse,
  UserIdDatabaseResponse,
  RemovalDatabaseResponse,
};
