// Controllers
const {
  index,
  signup,
  login,
  newToken,
  update
} = require('../controllers/users')

// Schemas
const schemas = require('../controllers/schemas/users')

// Routes
module.exports = (app, opts, next) => {
  // Index
  app.get('/', index)
  // Signup - Untuk mendaftar sebagai akun pengguna baru, sebelum membuat storage
  app.post('/signup', schemas.signup, signup)
  // Login - Untuk login, melihat informasi akun, daftar storage dll.
  app.post('/login', schemas.login, login)
  // Update - Untuk memperbarui informasi akun, seperti name, username,password, token, dll, kecuali, storage.
  app.put('/update', schemas.update, update)

  next()
}
