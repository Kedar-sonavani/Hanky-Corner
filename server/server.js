require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust the first proxy in production (e.g., Render, Heroku, Vercel)
// This is REQUIRED for rate limiting to work correctly and not block everyone if behind a load balancer
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// 1. CORS Configuration (MUST be first to handle preflight and rate-limit responses)
const getOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
    return [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://hankycorner.in',
        'https://www.hankycorner.in',
        ...envOrigins
    ];
};

app.use(cors({
    origin: (origin, callback) => {
        const allowed = getOrigins();
        // Allow if:
        // 1. Origin is missing (for server-to-server or tools like Postman)
        // 2. Origin is in our allowed list
        // 3. Origin is a Vercel preview branch
        if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.warn(`[CORS Blocked]: ${origin} - Not in allowed list:`, allowed);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-admin-secret'],
    optionsSuccessStatus: 200
}));

// 2. Security & Parsing
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server running');
});

app.use('/api/settings', require('./routes/settings'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments').router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
