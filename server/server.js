require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();


app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;


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
        if (!origin || allowed.includes(origin)) {
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
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", process.env.SUPABASE_URL || ''],
      }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiting
const globalLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });
const orderLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use(globalLimiter);

// Routes
app.get('/', (req, res) => {
  res.send('Server running');
});

app.use('/api/settings', require('./routes/settings'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', orderLimiter, require('./routes/orders'));
app.use('/api/payments', orderLimiter, require('./routes/payments').router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
