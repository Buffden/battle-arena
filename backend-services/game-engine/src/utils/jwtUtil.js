const jwt = require('jsonwebtoken');

class JwtUtil {
  static verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = JwtUtil; 