const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const celebrate = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const { requestLogger, errorLogger, consoleLogger } = require('./middlewares/logger');
const { auth } = require('./middlewares/auth');
const error = require('./middlewares/error');

const {
  login,
  logout,
  create,
} = require('./controllers/users');

const NotFound = require('./errors/NotFound');

require('dotenv').config();

const {
  PORT = 3000,
  NODE_ENV,
  CORS_UI_ADDRESS = 'http://localhost:3001',
} = process.env;

const app = express();

app.use(cors({
  origin: CORS_UI_ADDRESS,
  credentials: true,
}));
app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);
if (NODE_ENV !== 'production') {
  app.use(consoleLogger);
}

function postOrNotFound(req, res, next) {
  if (req.method === 'POST') {
    next();
  } else {
    next(new NotFound());
  }
}

app.use('/signout', postOrNotFound, logout);

app.use('/signin', postOrNotFound, celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    email: celebrate.Joi.string().required().email(),
    password: celebrate.Joi.string().required().min(8),
  }),
}), login);
app.use('/signup', postOrNotFound, celebrate.celebrate({
  body: celebrate.Joi.object().keys({
    name: celebrate.Joi.string().required().min(2).max(30),
    email: celebrate.Joi.string().required().email(),
    password: celebrate.Joi.string().required().min(8),
  }),
}), create);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(() => {
  throw new NotFound();
});

app.use(errorLogger);
app.use(celebrate.errors());
app.use(error);

mongoose.connect('mongodb://localhost:27017/movieexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
