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

const NotFound = require('./errors/NotFound');

require('dotenv').config();

const {
  PORT = 3000,
  NODE_ENV,
  CORS_UI_ADDRESS = 'http://localhost:3001',
  MONGO_ADDRESS = 'mongodb://localhost:27017/movieexplorerdb',
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

app.use('/', require('./routes/auth'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(() => {
  throw new NotFound();
});

app.use(errorLogger);
app.use(celebrate.errors());
app.use(error);

mongoose.connect(MONGO_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-enable no-console */
});
