require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Basic Middleware
app.use(express.json());

// CORS Configuration
const getOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
  return [
    'http://localhost:3000',
    'http://127.0.0.1:3000', // Still keep as a default for safety, but primary should be env
    ...envOrigins
  ];
};

app.use(cors({
  origin: (origin, callback) => {
    const allowed = getOrigins();
    
    // Allow requests with no origin (like mobile apps or server-side calls)
    if (!origin) return callback(null, true);
    
    // Check for exact match or ANY .vercel.app domain associated with the project
    const isAllowed = allowed.includes(origin) || 
                     origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      // During debugging, we can be more permissive if needed, but for now just log it
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('Server running');
});

// Routes
app.use('/api/settings', require('./routes/settings'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
