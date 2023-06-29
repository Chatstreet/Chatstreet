import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';
import { RegistrationRequestType } from '@app/type-guards/libs/token/registration.request.type-guard';
import { RegistrationResponseType } from '@app/type-guards/libs/token/registration.response.type-guard';

type ConnectCallbackType = (error?: Error) => void;

interface ConnectionMock {
  connect(callback: ConnectCallbackType): void;
}

interface DatabaseOperationsServiceMock {
  getInstance: jest.Mock<DatabaseOperationsServiceMock>;
  getConnection: jest.Mock<ConnectionMock>;
  getValidUserInformation: jest.Mock<JsonWebTokenUserPayloadType>;
  registerUser: jest.Mock<RegistrationResponseType>;
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
  registerUser: jest.fn((_: RegistrationRequestType): RegistrationResponseType => {
    return {
      username: 'Test',
      tag: 9999,
      email: 'example@example.com',
      firstName: 'Test',
      lastName: 'Test',
    };
  }),
};

export default databaseOperationsServiceMock;
