class Conflict extends Error {
  constructor(message = 'Уже существует') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Conflict;
