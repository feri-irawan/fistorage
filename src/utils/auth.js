const bcrypt = require('bcrypt')
const { join } = require('path')
const { createError } = require('./errors')
const Fistorage = require('./fistorage')

const fs = new Fistorage({ dir: join(__dirname, '../data') })
const USERS_DB = process.env.USERS_DB

/**
 * @description Mengenkripsi string menjadi string acak
 * @param {string} string Yang akan di hash
 * @returns {string} hash
 */
const hash = (string) => {
  const saltRounds = 10
  return new Promise((resolve) =>
    bcrypt.hash(string, saltRounds, (err, hash) => {
      resolve(hash)
    })
  )
}

/**
 * @description Memverifikasi string dengan string yang sudah dienkripsi
 * @param {string} string Yang akan dibandingkan dengan hash (paramater ke-2)
 * @param {string} hash Yang akan dibandingkan dengan string (parameter ke-1)
 * @returns boolean
 */
const verifyHash = (string, hash) => {
  return new Promise((resolve) =>
    bcrypt.compare(string, hash, function (err, result) {
      resolve(result)
    })
  )
}

/**
 * @description Mengecek token yang dikirimkan user
 * @param {string} token Token user yang akan dicek
 * @returns boolean
 */
const verifyToken = async (token) => {
  const prefix = 'token '
  if (!token.startsWith(prefix)) throw createError('Authorization invalid', 401)
  // Menghapus prefix
  const newToken = token.slice(prefix.length)
  // Mengambil semua users
  const users = (await fs.getContents(USERS_DB)).contents || []
  // Jika belum ada satu pun user
  if (users.length === 0) return false
  // Jika sudah ada beberapa users
  return users.find((user) => user.token === newToken) ? true : false
}

module.exports = {
  hash,
  verifyHash,
  verifyToken
}
