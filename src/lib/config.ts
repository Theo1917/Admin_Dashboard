export const config = {
  // Backend API configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : '', // Use relative path in production
  },
  
  // App configuration
  app: {
    name: 'Fitflix Admin',
    version: '1.0.0',
  }
};
