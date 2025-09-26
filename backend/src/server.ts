import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import measurementRoutes from './routes/measurements.js';
import planRoutes from './routes/plans.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;

// Security & CORS
console.log('🛡️ Setting up security middleware...');
// app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
console.log('✅ CORS middleware ready');

// Body parsing
console.log('🔧 Setting up middlewares...');

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
console.log('✅ JSON middleware ready');
app.use(express.urlencoded({ extended: true }));
console.log('✅ URL encoded middleware ready');

// Health check
app.get('/health', (req, res) => {
  console.log('📋 Health check request received');
  try {
    res.send('OK');
    console.log('✅ Health check response sent');
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).send('Error');
  }
});

// API Info endpoint
app.get('/api', (req, res) => {
  console.log('📋 API Info request received');
  try {
    res.json({
      name: 'Kajfasz Backend API',
      version: '1.0.0',
      description: 'Backend API for Personal Trainer Management System',
      endpoints: {
        auth: '/api/auth',
        clients: '/api/clients',
        measurements: '/api/measurements',
        plans: '/api/plans'
      }
    });
    console.log('✅ API Info response sent');
  } catch (error) {
    console.error('❌ API Info error:', error);
    res.status(500).json({ error: 'API Info failed' });
  }
});

// Public routes
console.log('🔗 Setting up routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes ready');

// Protected routes (require authentication)
app.use('/api/clients', authenticateToken, clientRoutes);
console.log('✅ Client routes ready');
app.use('/api/measurements', authenticateToken, measurementRoutes);
console.log('✅ Measurement routes ready');
app.use('/api/plans', authenticateToken, planRoutes);
console.log('✅ Plan routes ready');

// Test protected route
app.get('/api/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ 
    message: 'Protected route accessed successfully',
    trainer: req.trainer 
  });
});

// Error handling
console.log('❌ Setting up error handler...');
app.use(errorHandler);
console.log('✅ Error handler ready');

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown (temporarily disabled for debugging)
// process.on('SIGINT', async () => {
//   console.log('🔄 Shutting down gracefully...');
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('🔄 Shutting down gracefully...');
//   process.exit(0);
// });

console.log('💾 Shutdown handlers disabled for debugging');

app.listen(PORT, () => {
  console.log(`🚀 Kajfasz Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API Info: http://localhost:${PORT}/api`);
});

export default app;