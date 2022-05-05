function methodNotAllowed(req, res, nxt) {
    nxt({
      status: 405,
      message: `${req.method} not allowed for ${req.originalUrl}`,
    });
  }
  
  module.exports = methodNotAllowed;
  