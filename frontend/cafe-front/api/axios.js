import axios from 'axios';

const useCookieAuth = import.meta.env.VITE_USE_COOKIE_AUTH === 'true';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: useCookieAuth,
});

const csrfExcludedPaths = ['/health', '/csrf-token', '/users/login', '/users/register', '/users/forgot-password'];
const stateChangingMethods = ['post', 'put', 'patch', 'delete'];

let csrfToken = null;
let csrfTokenPromise = null;

const fetchCsrfToken = async () => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = API.get('/csrf-token', { __skipCsrfInterceptor: true })
      .then((response) => {
        csrfToken = response.data?.csrfToken || null;
        return csrfToken;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
};

API.interceptors.request.use(
  async (config) => {
    const nextConfig = { ...config, headers: { ...(config.headers || {}) } };

    if (nextConfig.__skipCsrfInterceptor) {
      delete nextConfig.__skipCsrfInterceptor;
      return nextConfig;
    }

    if (!useCookieAuth) {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        nextConfig.headers.Authorization = `Bearer ${token}`;
      }
      return nextConfig;
    }

    const method = (nextConfig.method || 'get').toLowerCase();
    const url = nextConfig.url || '';
    const isStateChanging = stateChangingMethods.includes(method);
    const shouldSkipCsrf = csrfExcludedPaths.some((path) => url.startsWith(path));

    if (!isStateChanging || shouldSkipCsrf) {
      return nextConfig;
    }

    if (!csrfToken) {
      await fetchCsrfToken();
    }

    if (csrfToken) {
      nextConfig.headers['X-CSRF-Token'] = csrfToken;
    }

    return nextConfig;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!useCookieAuth) {
      return Promise.reject(error);
    }

    const { response, config } = error;

    if (
      response?.status === 403 &&
      response.data?.message === 'Invalid CSRF token' &&
      config &&
      !config.__isRetryRequest
    ) {
      csrfToken = null;
      await fetchCsrfToken();

      config.__isRetryRequest = true;
      delete config.headers?.['X-CSRF-Token'];

      return API(config);
    }

    return Promise.reject(error);
  }
);

export default API;
