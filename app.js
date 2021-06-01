const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const helmet = require('helmet');

const { requestLogger, errorLogger, consoleLogger } = require('./middlewares/logger');

const error = require('./middlewares/error');
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

app.use(() => {
  throw new NotFound();
});

app.use(errorLogger);
app.use(error);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});