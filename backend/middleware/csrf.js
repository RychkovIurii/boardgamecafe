const csrf = require('csurf');

const isProduction = process.env.NODE_ENV === 'production';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Strict',
    secure: isProduction,
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
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

const csrfMiddleware = (req, res, next) => {
  if (shouldSkipCsrf(req)) {
    return next();
  }
  return csrfProtection(req, res, next);
};

const publishCsrfToken = (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    sameSite: isProduction ? 'None' : 'Strict',
    secure: isProduction,
    path: '/',
  });
  res.status(200).json({ csrfToken: token });
};

module.exports = {
  csrfMiddleware,
  publishCsrfToken,
};
