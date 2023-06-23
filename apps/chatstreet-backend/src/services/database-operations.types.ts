interface AuthenticationUserDataDatabaseResponse {
  RowDataPacket: {
    password: string;
    email: string;
    username: string;
    tag: number;
  };
}

export { AuthenticationUserDataDatabaseResponse };
