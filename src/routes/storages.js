// Controllers
const {
  index,
  createStorage,
  contentsStorage,
  updateStorage,
  deleteStorage
} = require('../controllers/storages')

// Schemas
const schemas = require('../controllers/schemas/storages')

// Routes
module.exports = (app, opts, next) => {
  // Index
  app.get('/', index)
  // Create - Untuk membuat storage baru
  app.post('/create', schemas.create, createStorage)
  // Contents - Untuk mendapatkan konten/isi storage
  app.get('/contents/:id', schemas.contents, contentsStorage)
  // Update - Untuk memperbaru konten/isi storage
  app.put('/update/:id', schemas.update, updateStorage)
  // Delete - Untuk menghapus storage
  app.delete('/delete/:id', schemas.delete, deleteStorage)

  next()
}
