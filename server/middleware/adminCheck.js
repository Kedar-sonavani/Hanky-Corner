const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client for Auth checks
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);


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

    // Query the server-controlled profiles table (not user-editable metadata)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Forbidden: Profile not found' });
    }

    const isAdmin = profile.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin Privileges Required' });
    }

    return next();
  }

  return res.status(403).json({ error: 'Forbidden: Admin Access Required' });
};

module.exports = adminCheck;
