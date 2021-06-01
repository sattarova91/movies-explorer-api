const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

const consoleLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.json(),
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
});

module.exports = {
  requestLogger,
  errorLogger,
  consoleLogger,
};
