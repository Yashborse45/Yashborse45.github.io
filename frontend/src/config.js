// API Configuration for production and development
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://xenith.onrender.com' 
    : 'http://localhost:5000'
};

export default config;