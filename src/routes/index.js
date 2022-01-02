// Contollers
const { index } = require('../controllers')

// Routes
module.exports = (app, opts, next) => {
  // Index
  app.get('/', index)

  next()
}
