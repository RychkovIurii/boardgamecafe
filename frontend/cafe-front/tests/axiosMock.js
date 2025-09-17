const createMockApi = () => {
  const mock = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  mock.get.mockResolvedValue({ data: [] });

  return mock;
};

const mockApiInstance = createMockApi();
const create = jest.fn(() => createMockApi());

module.exports = {
  __esModule: true,
  default: mockApiInstance,
  create,
};
