const request = require('supertest');
const https = require('https');

const HTTPS_OPTIONS = {
  key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNhvu3B8O28VXk
apFA4vF4LVdR58VUINeAM80W16eqyrIC73mwW+J1TfnlgD/sB6fM0GxvdTW661Ht
NvsEPSiqMnKl5w9m3sm0iD2WQvSazlMk/U1xxcKwQ+/1GNRi3AwmrhOXGn5H+8g8
DdmyHhJ0CThPrsb54JwdsI6uCZXKGxpUii81Z/jvsRlAK6LonYyLo5Zjdx8QvRyH
m/x0pCh0cNqgkC4aRhvCxOzA4NlBpZJe2Avs9QQxgolxD4p/rgz0XtV9dvQp5yun
kNHrEhW1BkabbuKsftdcCj7KbFc7VZdFJMZFYhHReBsIv75hvtz2Vgn9vZtX6pXn
Fy2uVwohAgMBAAECggEADw5haEIgW0mIskgARhGaAOTJbc2dzhDt2I1y68Z2mPNq
YP6sGnhQuakxsldX13GkIEPwfaXHft74THlnoCLe1MEHVxH7Nd0CR8BnSpezFZgh
zSblQn1rSsBfVsQv4uId3cOI2dvt/lX6kDOvi/XaAjgesO+r0ehbZ21ktmkrWPfL
tPvxU8W2OjwrsXNnb/C/KQymrSqHsDmWrwCIh6Gg72cgTMAbq438Jy9ue5fWr+ws
cIv9UginnGNKwwitLVPSxSGCTNG2pw3JPF83TT9AZgG350Xce/S8OqAR9bBcX8F+
yILA1tQ61eJnOh7LwPEOQPabtZ0Swy6MTGU0ajZYwQKBgQDn1sJD/DeLXrJMUOrs
cwNu84HzDWIBUb01qlvbMXhfzoL8DbrXRY6tOpT/u/9jlj/oirOn34lPBO2cLvR8
Mbha64ohrTE7lETDFT51MZEiHwCY7MmjqJZqcuiXfPRY2PnB38lL4b8r0HREaBDA
pA30aXoq6hnLdVoBKTvtkGxjuQKBgQDi8kFeybC4pZwa28j0/OyL4CBfd4Enn69I
kojVRPm8wXCvSIijr60MrTcJELN7HwHTKxZ7Fh0TjV3j6NInNK9btVA6HWAkyadM
dltWdhMuERVpzbELFtNacSP38Ew2eRS570X4dxhinKZbzHW61ejVPx9XacRRjRKb
utf0YIddqQKBgHPg9wauKUEjGvFkPJfkwOGTGu/WT5cjOPR66yC7MFSKzxOW9T2m
SbMyJclROUyYi+b6dOPCqknxx6YaHh95ZpEjS86bV5FVAa2Uj7xaAxXP8yd8qyh/
GneoabNWRHeoM+YAqgeglUIcFhEfBsiS91qj4elTS4NTa6JK7uZGGrcZAoGBAJV0
QlaA7m97KKWLbfjgg4rOC6OzGIwWniFl1tTUOr7yiRn1434gWA8MFz1SEVCYp+P/
8SsX8ggJRfasQZFuIbl8WxwaclFnt1QkcZwr4A+rUnW97sTFwGRENBK43gfVjy+v
gl3RWG7AiNHVgQaMjmu4yRQQ5Cdshv+leUhHNX4ZAoGAeCe+Ct7CGoE0y0BgRsZB
ICF3xb4B90xNAUnQkvI1Mi+eqOu7WifBYCi5y/BhhyDM04t/mNDRA66Xb7pL8Zpp
YXFhiLtxh4LCJTep7SMrBDyzG1TP2MoQe2eIY5u0VCxDLePKSNEOztjNyJridhXx
k2Bc86JivKtE3xNOqww4Jt4=
-----END PRIVATE KEY-----
`,
  cert: `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIUZC/RoFgghhzhB4wIzJ0HJqOJDQ8wDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI1MDkxODE5MTkxNloXDTI1MDkx
OTE5MTkxNlowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAzYb7twfDtvFV5GqRQOLxeC1XUefFVCDXgDPNFtenqsqy
Au95sFvidU355YA/7AenzNBsb3U1uutR7Tb7BD0oqjJypecPZt7JtIg9lkL0ms5T
JP1NccXCsEPv9RjUYtwMJq4Tlxp+R/vIPA3Zsh4SdAk4T67G+eCcHbCOrgmVyhsa
VIovNWf477EZQCui6J2Mi6OWY3cfEL0ch5v8dKQodHDaoJAuGkYbwsTswODZQaWS
XtgL7PUEMYKJcQ+Kf64M9F7VfXb0Kecrp5DR6xIVtQZGm27irH7XXAo+ymxXO1WX
RSTGRWIR0XgbCL++Yb7c9lYJ/b2bV+qV5xctrlcKIQIDAQABo1MwUTAdBgNVHQ4E
FgQU6tN+l9X2fpYxFSf7QUTNgdUWTeswHwYDVR0jBBgwFoAU6tN+l9X2fpYxFSf7
QUTNgdUWTeswDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAp703
ljIeKzHRUtyyC6l/Wq4AhCXoz+NVtiQmkSxydRNasync3CNwU/mW+w+n1sJQR+dg
jPIGP/WJ+KiFuI0z+KdJqyWLWKxC5Dolw3ywk4cuuvW2D+ppMQjkmyY1bV/kWopZ
4jp1bYD3ZtCckRgNnrP26naLJDaPPoKAwgoafh6qP1fVQ0EZEEDS0gWaSAi+XI5f
RVCMRUZNBYI/KJbcfJYU77sqEZJqSfGXvWt42eQ4j0cI4jTML6bJ1cXg3gPqO+PV
gOvqkO567ZwGI3Gs10pF5gggzYkJnIBGBNzco4MqF3ENDKNFOZ1RWNAVmLoH2BIU
EI/4TcS7/E6dobsGjg==
-----END CERTIFICATE-----
`,
};

const createHttpsAgent = (app) => new Promise((resolve) => {
  const server = https.createServer(HTTPS_OPTIONS, app).listen(0, () => {
    resolve({ server, agent: request.agent(server) });
  });
});

describe('CSRF protection for cookie-based auth', () => {
  let app;
  let server;
  let agent;
  const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  beforeAll(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  });

  afterAll(() => {
    if (originalRejectUnauthorized === undefined) {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    } else {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
    }
  });

  beforeEach(async () => {
    jest.resetModules();
    process.env.USE_COOKIE_AUTH = 'true';
    app = require('../src/app');
    const httpsSetup = await createHttpsAgent(app);
    server = httpsSetup.server;
    agent = httpsSetup.agent;
  });

  afterEach((done) => {
    delete process.env.USE_COOKIE_AUTH;
    jest.resetModules();
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  test('rejects state-changing request without CSRF token', async () => {
    const response = await request(server).post('/users/logout');
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
