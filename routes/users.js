const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getCurrent,
  updateCurrent,
} = require('../controllers/users');

router.get('/me', getCurrent);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateCurrent);

module.exports = router;