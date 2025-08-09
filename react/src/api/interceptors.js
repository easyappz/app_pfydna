import instance from './axios';

let isRedirecting401 = false;

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !isRedirecting401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}
      if (typeof window !== 'undefined') {
        const isOnLogin = window.location.pathname === '/login';
        if (!isOnLogin) {
          isRedirecting401 = true;
          window.location.replace('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);
