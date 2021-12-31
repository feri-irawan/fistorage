
# Fistorage

![Visitor](https://fibadge.vercel.app/badges/visitors/feri-irawan/fistorage)

JSON storage with API.

Fistorage adalah projek *open source* yang digunakan untuk menyimpan data seperti JSON yang dilakukan lewat permintaan API dilengkapi otentikasi.

Dibuat dengan ❤ dan Node.Js oleh [Feri Irawan](https://github.com/feri-irawan)

## Memulai Cepat

Ikuti langkah berikut untuk langsung membuat akun, membuat storage dan mengambil konten storage.

### Membuat Akun

```curl
curl -X POST 'https://fistorage.glitch.me/users/signup' \
-H 'Content-Type: application/json' \
-d '{
    "name":"<YOUR NAME>",
    "username":"<YOUR USERNAME>",
    "password":"<YOUR PASSWORD>"
}'
```

### Membuat Storage

```curl
curl -X POST 'https://fistorage.glitch.me/storages/create' \
-H 'Authorization: token <YOUR TOKEN>' \
-H 'Content-Type: application/json' \
-d '{
    "title": "My First Storage",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    "contents": "Hello world!"
}'
```

### Mendapatkan Konten Storage

```curl
curl -X GET 'https://fistorage.glitch.me/storages/contents/<STORAGE ID>' \
-H 'Authorization: token <YOUR TOKEN>'
```

Untuk panduan lengkapnya, kamu bisa membaca-baca penjelasan di bawah ini.

## Users

Langkah awal untuk menggunakan [Fistorage](https://github.com/feri-irawan/fistorage) adalah membuat sebuah akun. Akun ini akan digunakan untuk otentikasi pada storage, misalnya mengambil konten, mengubah, dan menghapus storage.

### Membuat Akun Baru

| Parameter      | Tipe   | Di     | Deskripsi                                                                      |
| -------------- | ------ | ------ | ------------------------------------------------------------------------------ |
| `Content-Type` | string | Header | Untuk memberitahu server kalau data yang dikirim adalah JSON                   |
| `name`         | string | body   | Nama akun baru                                                                 |
| `username`     | string | body   | Username akun baru (unik), ini akan digunakan untuk login, otentikasi lainnya. |
| `password`     | string | body   | Password akun baru, ini akan digunakan untuk login, otentikasi lainnya.        |

**Rute:**

```plaintext
POST /users/signup
```

**Contoh:**

```curl
curl -X POST 'https://fistorage.glitch.me/users/signup' \
-H 'Content-Type: application/json' \
-d '{
    "name":"<YOUR NAME>",
    "username":"<YOUR USERNAME>",
    "password":"<YOUR PASSWORD>"
}'
```

### Masuk ke Akun

| Parameter      | Tipe   | Di     | Deskripsi                                                    |
| -------------- | ------ | ------ | ------------------------------------------------------------ |
| `Content-Type` | string | Header | Untuk memberitahu server kalau data yang dikirim adalah JSON |
| `username`     | string | body   | Username akun milikmu                                        |
| `password`     | string | body   | Password akun milikmu                                        |

**Rute:**

```plaintext
POST /users/login
```

**Contoh:**

```curl
curl -X POST 'https://fistorage.glitch.me/users/login' \
-H 'Content-Type: application/json' \
-d '{
    "username":"<YOUR USERNAME>",
    "password":"<YOUR PASSWORD>"
}'
```

### Update Akun

| Parameter      | Tipe    | Di          | Deskripsi                                                                                                    |
| -------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `Content-Type` | string  | Header      | Untuk memberitahu server kalau data yang dikirim adalah JSON                                                 |
| `username`     | string  | body        | Username akun milikmu                                                                                        |
| `password`     | string  | body        | Password akun milikmu                                                                                        |
| `data`         | object  | body        | Data akun yang akan diubah (username, password, token)                                                       |
| `username`     | string  | body `data` | Username baru (opsional), jika diisi maka username akan diupdate sesuai dengan username baru yang dimasukkan |
| `password`     | string  | body `data` | Password baru (opsional), jika diisi maka password akan diupdate sesuai dengan password baru yang dimasukkan |
| `token`        | boolean | body `data` | (Opsional), jika diisi `true` maka token baru akan dihasilkan dan menggantikan token sebelumnnya             |

**Rute:**

```plaintext
PUT /users/update
```

**Contoh (hanya update password):**

```curl
curl -X PUT 'https://fistorage.glitch.me/users/update' \
-H 'Content-Type: application/json' \
-d '{
    "username":"<YOUR USERNAME>",
    "password":"<YOUR PASSWORD>"
    "data":{
        "password":"<NEW PASSWORD>"
    }
}'
```

## Storages

Berikut ini panduan untuk mengelola storage.

### Membuat Storage Baru

| Parameter       | Tipe                       | Di     | Deskripsi                                                    |
| --------------- | -------------------------- | ------ | ------------------------------------------------------------ |
| `Content-Type`  | string                     | Header | Untuk memberitahu server kalau data yang dikirim adalah JSON |
| `Authorization` | string                     | Header | Token untuk keperluan otentikasi                             |
| `title`         | string                     | body   | Judul storage (opsional)                                     |
| `description`   | string                     | body   | Deskripsi storage (opsional)                                 |
| `contents`      | semua, kecuali `undefined` | body   | Konten storage (opsional)                                    |

**Rute:**

```plaintext
POST /storages/create
```

**Contoh:**

```curl
curl -X POST 'https://fistorage.glitch.me/storages/create' \
-H 'Content-Type: application/json' \
-H 'Authorization: token <YOUR TOKEN>' \
-d '{
    "title":"My Blog Post",
    "description":"Storage for my blog post",
    "contents":[]
}'
```

### Mengambil Konten Storage

| Parameter       | Tipe   | Di     | Deskripsi                        |
| --------------- | ------ | ------ | -------------------------------- |
| `Authorization` | string | Header | Token untuk keperluan otentikasi |
| `id`            | string | URL    | Id storage milikmu               |

**Rute:**

```plaintext
GET /storages/contents/{id}
```

**Contoh:**

```curl
curl -X GET 'https://fistorage.glitch.me/storages/contents/76a998d1-26e5-4fd0-8db5-95b309387fe6' \
-H 'Authorization: token <YOUR TOKEN>'
```

### Memperbarui Storage

| Parameter       | Tipe                       | Di     | Deskripsi                                                    |
| --------------- | -------------------------- | ------ | ------------------------------------------------------------ |
| `Content-Type`  | string                     | Header | Untuk memberitahu server kalau data yang dikirim adalah JSON |
| `Authorization` | string                     | Header | Token untuk keperluan otentikasi                             |
| `id`            | string                     | URL    | Id storage milikmu                                           |
| `title`         | string                     | body   | Judul storage (opsional)                                     |
| `description`   | string                     | body   | Deskripsi storage (opsional)                                 |
| `contents`      | semua, kecuali `undefined` | body   | Konten storage (opsional)                                    |

**Rute:**

```plaintext
PUT /storages/update/{id}
```

**Contoh:**

```curl
curl -X POST 'https://fistorage.glitch.me/storages/update/76a998d1-26e5-4fd0-8db5-95b309387fe6' \
-H 'Authorization: token <YOUR TOKEN>' \
-H 'Content-Type: application/json' \
-d '{
    "title":"My Blog Post",
    "description":"Storage for my blog post",
    "contents":[
        {
            "title":"My First Post",
            "contents":"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus, hic.",
            "created_at":"2021-12-29T14:25:54.158Z"
        }
    ]
}'
```

### Menghapus Storage

| Parameter       | Tipe   | Di     | Deskripsi                        |
| --------------- | ------ | ------ | -------------------------------- |
| `Authorization` | string | Header | Token untuk keperluan otentikasi |
| `id`            | string | URL    | Id storage milikmu               |

**Rute:**

```plaintext
DELETE /storages/delete/{id}
```

**Contoh:**

```curl
curl -X DELETE 'https://fistorage.glitch.me/storages/delete/76a998d1-26e5-4fd0-8db5-95b309387fe6' \
-H 'Authorization: token <YOUR TOKEN>'
```

Seperti itulah panduan permintaan untuk mengelola [akun](#users) dan [storage](#storages) milikmu. Bagaimana mudah bukan?

Jika punya pertanyaan, masukan, atau permintaan lainnya tentang projek ini, silakan kirimkan di [issue](https://github.com/feri-irawan/fistorage/issues)
