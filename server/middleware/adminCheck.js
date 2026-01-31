const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client for Auth checks
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Middleware to verify if the user is an admin.
 * Strategies:
 * 1. Checks for a bespoke 'x-admin-secret' header (Quick MVP for "Master Switch" control).
 * 2. Verifies a Supabase JWT from the Authorization header (Robust production method).
 */
const adminCheck = async (req, res, next) => {
  // Strategy 1: Simple Secret (Useful for server-to-server or initial dev)
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
    return next();
  }

  // Strategy 2: Supabase Auth JWT
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
    }

    // Strict Admin Detection
    const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'admin@hankycorner.com';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin Privileges Required' });
    }

    return next();
  }

  return res.status(403).json({ error: 'Forbidden: Admin Access Required' });
};

module.exports = adminCheck;
