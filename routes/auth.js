const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const NotFound = require('../errors/NotFound');

const {
  login,
  logout,
  create,
} = require('../controllers/users');

function postOrNotFound(req, res, next) {
  if (req.method === 'POST') {
    next();
  } else {
    next(new NotFound());
  }
}

router.use('/signout', postOrNotFound, logout);

router.use('/signin', postOrNotFound, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/signup', postOrNotFound, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), create);

module.exports = router;
