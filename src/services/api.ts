import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('phishguard_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  res => {
    if (res.data?.success === false) throw new Error(res.data.error);
    return res.data?.data ?? res.data;
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    throw new Error(err.response?.data?.error || err.message);
  }
);

export const authAPI = {
  login:  (email: string, password: string) => instance.post('/api/auth/login', { email, password }),
  signup: (data: any) => instance.post('/api/auth/signup', data),
  logout: () => instance.post('/api/auth/logout'),
  me:     () => instance.get('/api/auth/me'),
};

export const scanAPI = {
  url:   (url: string) => instance.post('/api/scan/url', { url }),
  email: (content: string) => instance.post('/api/scan/email', { content }),
};

export const dashboardAPI = {
  stats:   () => instance.get('/api/dashboard/stats'),
  threats: () => instance.get('/api/dashboard/recent-threats'),
};

export const quizAPI = {
  questions:   () => instance.get('/api/quiz/questions'),
  submit:      (answers: number[]) => instance.post('/api/quiz/submit', { answers }),
  leaderboard: () => instance.get('/api/quiz/leaderboard'),
};

export const reportsAPI = {
  get: (from: number, type: string) => instance.get(`/api/reports?from=${from}&type=${type}`),
};
