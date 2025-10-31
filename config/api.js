export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://barber-api.vercel.app/api'  // ← Vercel URL
  : 'http://localhost:5000/api';