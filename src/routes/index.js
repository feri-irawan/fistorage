// Contollers
const { index } = require('../controllers')

module.exports = (app, opts, next) => {
  // Index
  app.get('/', index)

  next()
}
