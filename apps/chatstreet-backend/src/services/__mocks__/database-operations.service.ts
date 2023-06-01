type ConnectCallbackType = (error?: Error) => void;

interface ConnectionMock {
  connect(callback: ConnectCallbackType): void;
}

interface DatabaseOperationsServiceMock {
  getInstance: jest.Mock<DatabaseOperationsServiceMock>;
  getConnection: jest.Mock<ConnectionMock>;
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
};

export default databaseOperationsServiceMock;
