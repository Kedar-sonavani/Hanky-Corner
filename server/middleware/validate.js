const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Validation Failed',
      details: error.errors
    });
  }
};

module.exports = validate;
