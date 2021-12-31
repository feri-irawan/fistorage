const fs = require('fs')
const { createError } = require('./errors')
const { writeFile, readFile, appendFile, unlink } = fs.promises

/**
 * @name Fistorage
 * @description Class yang digunakan untuk CRUD dengan JSON
 */
class Fistorage {
  /**
   * @description Fungsi untuk mengatur direktori tempat penyimpanan file JSON
   * @param {string} dir Direktori/Folder penyimpanan JSON
   */
  constructor({ dir }) {
    this.dir = dir
  }

  /**
   * @description Fungsi untuk membuat file JSON
   * @param {string} id Id file JSON yang akan dibuat
   */
  createJson = async (
    id,
    { title = null, description = null, contents = null }
  ) => {
    const path = this.dir + `/${id}.json`
    const newContents = {
      title,
      description,
      contents,
      created_at: new Date(),
      updated_at: new Date()
    }

    try {
      await appendFile(path, JSON.stringify(newContents, null, 2), 'utf-8')
    } catch (error) {
      throw createError('Gagal membuat file JSON', 500)
    }
  }

  /**
   * @description Fungsi untuk menghapus file JSON yang sudah ada
   * @param {string} id Id file JSON yang akan di hapus
   * @returns boolean
   */
  deleteJson = async (id) => {
    const path = this.dir + `/${id}.json`
    if (!fs.existsSync(path)) throw createError('JSON tidak ditemukan', 404)

    return await unlink(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * @description Fungsi untuk mengambil isi file JSON. Fungsi ini akan mengembalikan JSON yang sudah di parsing
   * @param {string} id Id file JSON yang akan di ambil isinya
   * @returns object
   */
  getContents = async (id) => {
    const path = this.dir + `/${id}.json`
    if (!fs.existsSync(path)) throw createError('JSON tidak ditemukan', 404)

    return await readFile(path, 'utf-8').then((contents) =>
      JSON.parse(contents)
    )
  }

  /**
   * @description Fungsi untuk menyimpan/mengubah isi file JSON dengan konten baru
   * @param {string} id Id file JSON yang digunakan untuk menyimpan data
   * @param {object} contents Isi file JSON yang akan disimpan
   */
  saveContents = async (
    id,
    { contents = undefined, title = undefined, description = undefined }
  ) => {
    // Membuat path
    const path = this.dir + `/${id}.json`
    // Mengecek path, apakah filenya sudah ada?, jika tidak maka throw 404
    if (!fs.existsSync(path)) throw createError('JSON tidak ditemukan', 404)

    // Mengambil contents lama
    const oldContents = await this.getContents(id)

    // Membuat contents baru
    const newContents = {
      ...oldContents,
      title: typeof title === 'undefined' ? oldContents.title : title,

      description:
        typeof description === 'undefined'
          ? oldContents.description
          : description,

      contents:
        typeof contents === 'undefined' ? oldContents.contents : contents,

      updated_at: new Date()
    }

    // Menyimpan/menulis ulang contents baru ke dalam file JSON
    await writeFile(path, JSON.stringify(newContents, null, 2), 'utf-8')
  }
}

module.exports = Fistorage
