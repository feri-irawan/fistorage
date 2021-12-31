/**
 * @description Membuat error
 * @param {string} message Pesan error
 * @param {number} code Kode error
 * @returns {Error} Error
 */
const createError = (message, code) => {
  const error = new Error(message)
  error.statusCode = code

  return error
}

module.exports = {
  createError
}
