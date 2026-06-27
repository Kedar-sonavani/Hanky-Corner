const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        const sanitized = Array.isArray(error.errors)
          ? error.errors.map(e => ({ message: e.message, path: e.path }))
          : error.errors;
        console.error('❌ Validation Error (sanitized):', JSON.stringify(sanitized, null, 2));
    }
    return res.status(400).json({
      error: 'Validation Failed',
      details: process.env.NODE_ENV === 'development' ? error.errors : undefined
    });
  }
};

module.exports = validate;
