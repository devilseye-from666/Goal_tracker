export const API_BASE_URL = import.meta.env.PROD
  ? 'https://goal-tracker-ohcq.onrender.com/api'  // Your Render backend URL
  : '/api';  // Local dev uses proxy
