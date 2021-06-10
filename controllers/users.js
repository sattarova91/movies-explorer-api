const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { sign } = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

module.exports.create = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const resUser = user; // prevents lint error "no-param-reassign"
      resUser.password = undefined;
      res.send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(`Переданы некорректные данные. ${err.message}`);
      } else if (err.code === 11000) { // duplicate key error
        throw new Conflict('Такой пользователь уже существует');
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.getAll = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

function getById(userId, req, res, next) {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest();
      } else {
        throw err;
      }
    })
    .catch(next);
}

module.exports.getCurrent = (req, res, next) => {
  getById(req.user._id, req, res, next);
};

module.exports.updateCurrent = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    name,
    email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest();
      } else if (err.name === 'MongoError' && err.codeName === 'DuplicateKey') {
        throw new Conflict();
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = sign({
        _id: user._id,
      });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send(user);
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: true,
  }).send({});
};
