require('dotenv').config()
const fastify = require('fastify')

const app = fastify({ logger: true })
const PORT = process.env.PORT || 3000

// Rute
app.register(require('./routes'))
app.register(require('./routes/users'), { prefix: '/users' })
app.register(require('./routes/storages'), { prefix: '/storages' })

// Mengubah bentuk respon error
app.setErrorHandler((err, req, rep) => {
  const statusCode = rep.statusCode
  const message = err.message

  rep.status(statusCode).send({ code: statusCode, message })
})

app.setNotFoundHandler((req, rep) => {
  rep.status(404).send({ code: 404, message: 'Rute tidak ditemukan' })
})

// Start server
const start = async () => {
  try {
    await app.listen(PORT)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

module.exports = start()
