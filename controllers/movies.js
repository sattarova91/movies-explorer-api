const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');
const Forbidden = require('../errors/Forbidden');

module.exports.getAll = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies.reverse());
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(`Переданы некорректные данные. ${err.message}`);
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.del = (req, res, next) => {
  Movie.findById({
    _id: req.params.movieId,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFound();
      } else if (String(movie.owner) !== req.user._id) {
        throw new Forbidden();
      } else {
        Movie.findOneAndDelete({
          _id: req.params.movieId,
          owner: req.user._id,
        })
          .then((dbmovie) => {
            res.send(dbmovie);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(`Переданы некорректные данные. ${err.message}`);
      } else {
        throw err;
      }
    })
    .catch(next);
};