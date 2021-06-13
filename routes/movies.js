const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  create,
  getAll,
  del,
} = require('../controllers/movies');

const urlPattern = /^(((https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;

router.get('/', getAll);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(0),
    year: Joi.number().required().min(1900).max(3000),
    description: Joi.string().required().min(2).max(120),
    image: Joi.string().required().pattern(urlPattern),
    trailer: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(urlPattern),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), create);

router.delete('/:movieId', del);

module.exports = router;
