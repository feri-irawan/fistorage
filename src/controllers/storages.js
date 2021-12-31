const Fistorage = require('../utils/fistorage')
const { join } = require('path')
const {
  getUser,
  addStorage,
  findStorage,
  deleteStorage,
  updateStorage
} = require('../utils/users')

const fs = new Fistorage({ dir: join(__dirname, '../data') })

// Index
exports.index = (req, rep) => {
  return {
    code: 200,
    message: 'Storages Route'
  }
}

// Membuat storage
exports.createStorage = async (req, rep) => {
  const { authorization } = req.headers

  let title = null
  let description = null
  let contents = null

  if (req.body) {
    title = req.body.title || title
    description = req.body.description || description
    contents = req.body.contents || contents
  }

  try {
    // Mendapatkan data user berdasarkan token
    const user = await getUser(authorization)
    // Menambah storage di data user, dan mendapatkan id storage
    const storage = await addStorage(user.index, { title, description })
    // Membuat JSON
    await fs.createJson(storage.id, {
      title: storage.title,
      description: storage.description,
      contents
    })

    return {
      code: 200,
      message: 'Berhasil membuat storage.',
      data: { ...storage, contents }
    }
  } catch (error) {
    return error
  }
}

// Memuat contents
exports.contentsStorage = async (req, rep) => {
  const { id } = req.params
  const { authorization } = req.headers

  try {
    // Mendapatkan data user berdasarkan token
    const user = (await getUser(authorization)).data
    // Mencari storage pada data user berdasarkan id storage
    const storage = await findStorage(user, id)
    // Mendapatkan contents storage
    const contents = await fs.getContents(storage.id)

    return {
      code: 200,
      message: `Contents storage`,
      data: { id: storage.id, ...contents }
    }
  } catch (error) {
    return error
  }
}

// Memperbarui/mengubah contents
exports.updateStorage = async (req, rep) => {
  const { id } = req.params
  const { authorization } = req.headers

  let title, description, contents
  if (req.body) {
    title = typeof req.body.title === 'undefined' ? undefined : req.body.title

    description =
      typeof req.body.description === 'undefined'
        ? undefined
        : req.body.description

    contents =
      typeof req.body.contents === 'undefined' ? undefined : req.body.contents
  }

  try {
    // Mendapatkan data user berdasarkan token
    const user = await getUser(authorization)
    // Mencari storage pada data user berdasarkan id storage
    const storage = await findStorage(user.data, id)
    // Meperbarui storage pada data user
    await updateStorage(user.index, storage.id, { title, description })
    // Meperbarui contents file storage
    await fs.saveContents(storage.id, { contents, title, description })

    return {
      code: 200,
      message: `Berhasil memperbarui data storage`,
      data: await fs.getContents(id)
    }
  } catch (error) {
    return error
  }
}

// Menghapus storage
exports.deleteStorage = async (req, rep) => {
  const { id } = req.params
  const { authorization } = req.headers
  try {
    // Mendapatkan data user berdasarkan token
    const user = await getUser(authorization)
    // Mencari storage pada data user berdasarkan id
    const storage = await findStorage(user.data, id)
    // Menghapus storage pada data user berdaasrkan id
    await deleteStorage(user.index, id)
    // Menghapus file storage berdasarkan id
    await fs.deleteJson(storage.id)

    return {
      code: 200,
      message: 'Berhasil menghapus storage.'
    }
  } catch (error) {
    return error
  }
}
