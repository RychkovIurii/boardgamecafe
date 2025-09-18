const request = require('supertest');

describe('CSRF protection for cookie-based auth', () => {
  let app;
  let agent;

  beforeEach(() => {
    jest.resetModules();
    process.env.USE_COOKIE_AUTH = 'true';
    app = require('../src/app');
    agent = request.agent(app);
  });

  afterEach(() => {
    delete process.env.USE_COOKIE_AUTH;
    jest.resetModules();
  });

  test('rejects state-changing request without CSRF token', async () => {
    const response = await request(app).post('/users/logout');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Invalid CSRF token');
  });

  test('accepts state-changing request with valid CSRF token', async () => {
    const tokenResponse = await agent.get('/csrf-token');
    const { csrfToken } = tokenResponse.body;

    expect(csrfToken).toBeDefined();

    const response = await agent
      .post('/users/logout')
      .set('X-CSRF-Token', csrfToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged out');
  });
});
