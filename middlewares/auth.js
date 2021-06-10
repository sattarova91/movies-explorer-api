const jwt = require('jsonwebtoken');
require('dotenv').config();
const Unauthorized = require('../errors/Unauthorized');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports.sign = (playload) => jwt.sign(
  playload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  { expiresIn: '7d' },
);

function verify(token) {
  return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
}

module.exports.verify = verify;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new Unauthorized();
  }

  let payload;

  try {
    payload = verify(token);
  } catch (err) {
    throw new Unauthorized();
  }

  req.user = payload;

  next();
};
