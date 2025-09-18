const Tokens = require('csrf');
const crypto = require('crypto');

const tokens = new Tokens();

// Use a strong key from environment variables in production!
const RAW_CSRF_KEY = process.env.CSRF_ENC_KEY || 'replace_this_with_32_byte_strong_key!';
const CSRF_ENC_KEY = crypto.createHash('sha256').update(RAW_CSRF_KEY, 'utf8').digest().slice(0, 32);

const isProduction = process.env.NODE_ENV === 'production';
const CSRF_PUBLIC_COOKIE = 'XSRF-TOKEN';
const CSRF_SECRET_COOKIE = 'XSRF-SECRET';
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const cookieOptions = (httpOnly, forceSecure = false) => ({
  httpOnly,
  sameSite: isProduction ? 'None' : 'Strict',
  secure: forceSecure ? true : isProduction,
  path: '/',
});

const csrfExcludedPaths = new Set([
  '/health',
  '/users/login',
  '/users/register',
  '/users/forgot-password',
]);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', CSRF_ENC_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(encrypted) {
  try {
    const [ivHex, encryptedHex] = encrypted.split(':');
    if (!ivHex || !encryptedHex) {
      return null;
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', CSRF_ENC_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error) {
    return null;
  }
}

const normalizePath = (path) => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.replace(/\/+$/, '');
  }
  return path;
};

const shouldSkipCsrf = (req) => {
  const normalizedPath = normalizePath(req.path);
  if (csrfExcludedPaths.has(normalizedPath)) {
    return true;
  }

  if (process.env.USE_COOKIE_AUTH !== 'true') {
    const authHeader = (req.headers.authorization || '').toLowerCase();
    if (authHeader.startsWith('bearer ')) {
      return true;
    }
  }

  return false;
};

const issueCsrfToken = (req, res) => {
  let secret;
  const encSecret = req.cookies[CSRF_SECRET_COOKIE];

  if (encSecret) {
    secret = decrypt(encSecret);
  }

  if (!secret) {
    secret = tokens.secretSync();
  }

  res.cookie(
    CSRF_SECRET_COOKIE,
    encrypt(secret),
    {
      ...cookieOptions(true, true),
      httpOnly: true,
      secure: true,
    },
  );

  const token = tokens.create(secret);

  res.cookie(CSRF_PUBLIC_COOKIE, token, cookieOptions(false));

  return token;
};

const getTokenFromRequest = (req) => {
  const headerToken = req.get('X-CSRF-Token') || req.get('X-XSRF-TOKEN');
  if (headerToken) {
    return headerToken;
  }

  if (req.body && typeof req.body === 'object' && req.body._csrf) {
    return req.body._csrf;
  }

  if (req.query && typeof req.query === 'object' && req.query._csrf) {
    return req.query._csrf;
  }

  return req.cookies[CSRF_PUBLIC_COOKIE];
};

const createCsrfError = () => {
  const error = new Error('Invalid CSRF token');
  error.code = 'EBADCSRFTOKEN';
  return error;
};

const csrfMiddleware = (req, res, next) => {
  req.csrfToken = () => issueCsrfToken(req, res);

  if (shouldSkipCsrf(req) || !PROTECTED_METHODS.includes(req.method.toUpperCase())) {
    return next();
  }

  const encSecret = req.cookies[CSRF_SECRET_COOKIE];
  const secret = encSecret ? decrypt(encSecret) : null;
  const token = getTokenFromRequest(req);

  if (!secret || !token || !tokens.verify(secret, token)) {
    return next(createCsrfError());
  }

  return next();
};

const publishCsrfToken = (req, res) => {
  const token = req.csrfToken();

  res.status(200).json({ csrfToken: token });
};

module.exports = {
  csrfMiddleware,
  publishCsrfToken,
};
