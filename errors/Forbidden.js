class Forbidden extends Error {
  constructor(message = 'Отказано') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
