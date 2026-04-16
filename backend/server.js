const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ========== SECURITY MIDDLEWARE ==========

// Helmet: Set HTTP headers for security
app.use(helmet());

// Compression: Compress responses
app.use(compression());

// CORS: Strict origin control
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5000,https://primewaveshades.works,https://www.primewaveshades.works,https://prime-wave-executive-shades.vercel.app').split(',').map(o => o.trim());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Rate Limiting: Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.MAX_REQUESTS_PER_MINUTE || 60,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/register', authLimiter);

// Data sanitization: Prevent MongoDB injection
app.use(mongoSanitize());

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== DATABASE CONNECTION ==========
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected securely');
  
  // Seed default admin user if none exists
  try {
    const Admin = require('./models/Admin');
    
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      // Don't hash here - let the pre-save hook handle it
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@primewaveshades.com',
        password: 'admin123', // Plain password - model will hash it
      });
      await defaultAdmin.save();
      console.log('✅ Default admin user created: username=admin, password=admin123');
    }
  } catch (seedError) {
    console.error('⚠️ Admin seed error:', seedError.message);
  }
})
.catch(err => console.log('MongoDB connection error:', err));

// ========== ROUTES ==========
const productRoutes = require('./routes/products');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Prime Wave Executive Shades API is running', status: 'OK' });
});

app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// Health check (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS not allowed' });
  }
  
  res.status(err.status || 500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Export for Vercel serverless functions
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}
