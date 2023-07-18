import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';
import { AuthenticationResponseType } from '@app/type-guards/libs/token/authenticaton.response.type-guard';
import { RegistrationRequestType } from '@app/type-guards/libs/token/registration.request.type-guard';
import { RegistrationResponseType } from '@app/type-guards/libs/token/registration.response.type-guard';
import { v4 as uuid } from 'uuid';

type ConnectCallbackType = (error?: Error) => void;

interface ConnectionMock {
  connect(callback: ConnectCallbackType): void;
}

interface DatabaseOperationsServiceMock {
  getInstance: jest.Mock<DatabaseOperationsServiceMock>;
  validateUserCredentials: jest.Mock<boolean>;
  registerUser: jest.Mock<RegistrationResponseType>;
  getJsonWebTokenHash: jest.Mock<string>;
  getUserInformationFromJwtHash: jest.Mock<AuthenticationResponseType>;
  getConnection: jest.Mock<ConnectionMock>;
}

const databaseOperationsServiceMock: DatabaseOperationsServiceMock = {
  getInstance: jest.fn((): DatabaseOperationsServiceMock => {
    return databaseOperationsServiceMock;
  }),
  validateUserCredentials: jest.fn((userData: AuthenticationRequestType): boolean => {
    // custom responses based on request type
    return !!userData;
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
  getJsonWebTokenHash: jest.fn((_: AuthenticationRequestType): string => {
    return uuid();
  }),
  getUserInformationFromJwtHash: jest.fn((_: string): AuthenticationResponseType => {
    return {
      username: 'Test',
      tag: 9999,
      email: 'example@example.com',
      role: 'USER',
    };
  }),
  getConnection: jest.fn((): ConnectionMock => {
    return {
      connect: (callback: ConnectCallbackType) => callback(),
    };
  }),
};

export default databaseOperationsServiceMock;
