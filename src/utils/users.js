const { join } = require('path')
const { v4: uuidv4 } = require('uuid')
const { hash, verifyHash } = require('./auth')
const { createError } = require('./errors')
const Fistorage = require('./fistorage')

const fs = new Fistorage({ dir: join(__dirname, '../data') })
const USERS_DB = process.env.USERS_DB

/**
 * @description Menambah user ke dalam database users
 * @param {string} name Nama pengguna
 * @param {string} username Username pengguna
 * @param {string} password Password pengguna
 */
const addUser = async (name = null, username, password) => {
  // Validasi username
  if (!username.match('^[a-zA-Z0-9-]*$'))
    throw createError(
      'Username tidak boleh mengandung karakter lain, selain huruf alphabet, angka, dan tanda -',
      400
    )

  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []

  const checkUser = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  )
  if (checkUser) throw createError(`Username '${username}' tidak tersedia`, 409)

  // Menambah users
  const userInfo = {
    id: await userId(),
    name,
    username,
    password: await hash(password),
    token: uuidv4(),
    created_at: new Date(),
    updated_at: new Date(),
    storages: []
  }
  users.push(userInfo)

  // Menyimpan users
  try {
    await fs.saveContents(USERS_DB, { contents: users })
    return userInfo
  } catch {
    throw createError('Gagal menambah pengguna', 500)
  }
}

/**
 * @description Membuat user id
 * @returns {number} new user id
 */
const userId = async () => {
  const users = (await fs.getContents(USERS_DB)).contents || []
  if (users.length === 0) return 1

  return users.slice(-1)[0].id + 1
}

/**
 * @description Mendapatkan data satu user
 * @param {string} token Token pengguna
 * @returns {object} User
 */
const getUser = async (token) => {
  const prefix = 'token '
  if (!token.startsWith(prefix)) throw createError('Authorization invalid', 401)

  // Menghapus prefix
  const newToken = token.slice(prefix.length)

  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []
  // Jika belum ada satu pun user
  if (users.length === 0) createError('Token invalid', 403)

  // Jika sudah ada beberapa users
  const user = users
    .map((user, i) => ({ index: i, data: user }))
    .find(({ data }) => data.token === newToken)

  // Jika user tidak ditemukan
  if (!user) throw createError('Token invalid', 403)

  return user
}

/**
 * @description Untuk mengecek apakah ada user dengan username dan password yang sama (LOGIN)
 * @param {string} username Username yang akan dicek
 * @param {string} password Password yang akan dicek
 * @returns {object} User
 */
const login = async (username, password) => {
  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []
  // Jika belum ada satu pun user
  if (users.length === 0)
    throw createError('Username atau password salah!', 401)

  // Jika sudah ada beberapa users
  // Cari user dengan username yang sama
  const user = users
    .map((user, index) => ({ index, data: user })) // Mengambil indexnya
    .find(({ data }) => data.username.toLowerCase() === username.toLowerCase()) // Mengecek usernamenya

  // Jika tidak ditemukan user dengan username yang sama
  if (!user) throw createError('Username atau password salah!', 401)

  // Jika user ditemukan
  const usernameCheck =
    username.toLowerCase() === user.data.username.toLowerCase()
  const passwordCheck = await verifyHash(password, user.data.password)

  // Verifikasi, apakah username dan password sama-sama true?
  const verify = usernameCheck && passwordCheck ? true : false

  // Jika verify bernilai false
  if (!verify) throw createError('Username atau password salah!', 401)

  // Jika verify bernilai true
  return user
}

/**
 * @description Mengupdate data user, bukan storage
 * @param {number} userIndex Index user yang akan diupdate (index didapatkan dari hasil login()). Default: `undefined`
 * @param {object} data Data yang akan diubah
 * @param {string} data.name Nama baru. Default: `undefined`
 * @param {string} data.username Username baru. Default: `undefined`
 * @param {string} data.password Password baru. Default: `undefined`
 * @param {boolean} data.token Jika `true` maka token baru akan dihasilkan. Default: `false`
 */
const updateUser = async (
  userIndex = undefined,
  data = {
    name: undefined,
    username: undefined,
    password: undefined,
    token: false
  }
) => {
  if (typeof userIndex === 'undefined')
    throw createError('User tidak ditemukan', 404)

  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []
  // Jika belum ada satu pun user
  if (users.length === 0) throw createError('Pengguna tidak ditemukan', 404)

  const { name, username, password, token } = data

  // Validasi username

  if (username && !username.match('^[a-zA-Z0-9-]*$'))
    throw createError(
      'Username tidak boleh mengandung karakter lain, selain huruf alphabet, angka, dan tanda -',
      400
    )

  // Update name
  if (typeof name !== 'undefined') users[userIndex].name = name

  // Update username
  if (typeof username !== 'undefined') users[userIndex].username = username

  // Update password
  if (typeof password !== 'undefined')
    users[userIndex].password = await hash(password)

  // Update token
  if (token) users[userIndex].token = uuidv4()

  // Update updated_at
  users[userIndex].updated_at = new Date()

  // Menyimpan users
  try {
    await fs.saveContents(USERS_DB, { contents: users })
    return users[userIndex]
  } catch {
    throw createError('Gagal memperbarui data user', 500)
  }
}

/**
 * @description Menambah daftar storages pada data user
 * @param {integer} userIndex Index user pada array (pada di database users)
 * @param {string} title Nama storage (optional)
 * @param {string} description Deskripsi storage (optional)
 * @returns {number} storage id
 */
const addStorage = async (userIndex, { title = null, description = null }) => {
  // Id storage yang akan dibuat
  const id = uuidv4()
  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []

  // Storage object
  const storageObject = {
    id,
    title,
    description,
    created_at: new Date(),
    updated_at: new Date()
  }

  // Memperbarui tanggal update
  users[userIndex].updated_at = new Date()
  // Menambah storage ke dalam daftar storages user
  users[userIndex].storages.push(storageObject)

  // Menyimpan users
  try {
    await fs.saveContents(USERS_DB, { contents: users })
    return storageObject
  } catch {
    throw createError('Gagal menambah storages pengguna', 500)
  }
}

/**
 * @description Mencari storage user
 * @param {object} userObject User objeck yang dihasilkan oleh getUser()
 * @param {string} storageId Storage id
 * @returns {object} Storage info
 */
const findStorage = async (userObject, storageId) => {
  const storageObject = userObject.storages.find(({ id }) => id === storageId)

  if (!storageObject) throw createError('Storage tidak ditemukan', 404)

  return storageObject
}

/**
 * @description Memperbarui storage user
 * @param {string} userIndex Id user (yang di hasilkan oleh getuser())
 * @param {string} storageId Id storage yang akan diperbarui
 */
const updateStorage = async (
  userIndex,
  storageId,
  { title = undefined, description = undefined }
) => {
  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []

  // Menghapus object storage dengan cara memfilter
  const storage = users[userIndex].storages
    .map((storageInfo, index) => ({ index, ...storageInfo }))
    .find(({ id }) => id === storageId)

  const index = storage.index
  const storageTitle = storage.title
  const storageDesc = storage.description

  // Memperbarui title
  users[userIndex].storages[index].title =
    typeof title === 'undefined' ? storageTitle : title

  // Memperbarui description
  users[userIndex].storages[index].description =
    typeof description === 'undefined' ? storageDesc : description

  // Memperbarui tanggal update
  users[userIndex].updated_at = new Date()
  users[userIndex].storages[index].updated_at = new Date()

  // Menyimpan users
  try {
    await fs.saveContents(USERS_DB, { contents: users })
  } catch {
    throw createError('Gagal mengapus storage pengguna', 500)
  }
}

/**
 * @description Menghapus storage user
 * @param {string} userIndex Id user (yang di hasilkan oleh getuser())
 * @param {string} storageId Id storage yang akan dihapus
 */
const deleteStorage = async (userIndex, storageId) => {
  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []

  // Menghapus object storage dengan cara memfilter
  const storagesRemain = users[userIndex].storages.filter(
    ({ id }) => id !== storageId
  )

  // Memperbarui tanggal
  users[userIndex].updated_at = new Date()
  // Menyusun ulang storage dengan storage yang tersisa
  users[userIndex].storages = storagesRemain

  // Menyimpan users
  try {
    await fs.saveContents(USERS_DB, { contents: users })
  } catch {
    throw createError('Gagal mengapus storage pengguna', 500)
  }
}

module.exports = {
  addUser,
  getUser,
  login,
  updateUser,
  addStorage,
  findStorage,
  updateStorage,
  deleteStorage
}
