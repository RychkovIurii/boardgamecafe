const Tokens = require('csrf');
const crypto = require('crypto');

// Use a strong key from environment variables in production!
const CSRF_ENC_KEY = process.env.CSRF_ENC_KEY || 'replace_this_with_32_byte_strong_key!';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(CSRF_ENC_KEY, 'utf-8'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  // Prepend IV for decryption
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encrypted) {
  try {
    const parts = encrypted.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(CSRF_ENC_KEY, 'utf-8'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (e) {
    return null;
  }
}
const isProduction = process.env.NODE_ENV === 'production';

const CSRF_PUBLIC_COOKIE = 'XSRF-TOKEN';
const CSRF_SECRET_COOKIE = 'XSRF-SECRET';
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const cookieOptions = (httpOnly) => ({
  httpOnly,
  sameSite: isProduction ? 'None' : 'Strict',
  secure: isProduction,
  path: '/',
});

const csrfExcludedPaths = [
  '/health',
  '/users/login',
  '/users/register',
  '/users/forgot-password',
];

const shouldSkipCsrf = (req) => {
  if (csrfExcludedPaths.some((path) => req.path.startsWith(path))) {
    return true;
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return true;
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

  // Store encrypted secret in cookie
  res.cookie(CSRF_SECRET_COOKIE, encrypt(secret), {
    ...cookieOptions(true),
  });

  const token = tokens.create(secret);

  res.cookie(CSRF_PUBLIC_COOKIE, token, {
    ...cookieOptions(false),
  });

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
