import { env } from './config/env.js';
import { app } from './app.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`📡 API: http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
