import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';

type ConnectCallbackType = (error?: Error) => void;

interface ConnectionMock {
  connect(callback: ConnectCallbackType): void;
}

interface DatabaseOperationsServiceMock {
  getInstance: jest.Mock<DatabaseOperationsServiceMock>;
  getConnection: jest.Mock<ConnectionMock>;
  getValidUserInformation: jest.Mock<JsonWebTokenUserPayloadType>;
}

const databaseOperationsServiceMock: DatabaseOperationsServiceMock = {
  getInstance: jest.fn((): DatabaseOperationsServiceMock => {
    return databaseOperationsServiceMock;
  }),
  getConnection: jest.fn((): ConnectionMock => {
    return {
      connect: (callback: ConnectCallbackType) => callback(),
    };
  }),
  getValidUserInformation: jest.fn((_: AuthenticationRequestType): JsonWebTokenUserPayloadType => {
    return {
      username: 'Test',
      tag: 9999,
      email: 'test@example.com',
    };
  }),
};

export default databaseOperationsServiceMock;
