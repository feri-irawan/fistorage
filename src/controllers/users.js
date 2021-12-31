const { createError } = require('../utils/errors')
const { addUser, login, updateUser } = require('../utils/users')

// Index
exports.index = (req, rep) => {
  return {
    code: 200,
    message: 'Fistorage Users'
  }
}

// Signup
exports.signup = async (req, rep) => {
  const { name, username, password } = req.body

  try {
    // Menambah user ke database
    const data = await addUser(name, username, password).then((user) => ({
      ...user,
      password: `[HASHED] ${user.password.slice(0, 16)}...`
    }))

    return {
      code: 200,
      message: 'Berhasil mendaftar',
      data
    }
  } catch (error) {
    return error
  }
}

// Login
exports.login = async (req, rep) => {
  const { username, password } = req.body
  try {
    const data = await login(username, password).then(({ data }) => ({
      ...data,
      password: `[HASHED] ${data.password.slice(0, 16)}...`
    }))

    return {
      code: 200,
      message: 'Login berhasil',
      data
    }
  } catch (error) {
    return error
  }
}

// Update
exports.update = async (req, rep) => {
  const { username, password, data } = req.body
  try {
    // Mendapatkan index user
    const userIndex = (await login(username, password)).index

    // Jika data kosong
    if (Object.keys(data).length === 0)
      throw createError("Properti 'data' tidak boleh kosong", 400)

    // Mengupdate user
    const updated = await updateUser(userIndex, data).then((user) => {
      delete user.storages
      return user
    })

    return {
      code: 200,
      message: 'Berhasil memperbarui user',
      data: updated
    }
  } catch (error) {
    return error
  }
}
