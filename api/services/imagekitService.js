const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload'
const IMAGEKIT_API_URL = 'https://api.imagekit.io/v1'

function getAuthHeader() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is missing')
  }

  const token = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
  return `Basic ${token}`
}

function getFolder() {
  return process.env.IMAGEKIT_FOLDER || '/sundarban/gallery'
}

async function uploadImage(file, fileName) {
  if (!process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error('IMAGEKIT_URL_ENDPOINT is missing')
  }

  const formData = new FormData()
  formData.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname)
  formData.append('fileName', fileName)
  formData.append('folder', getFolder())
  formData.append('useUniqueFileName', 'true')

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
    },
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Image upload failed')
  }

  return result
}

async function deleteImage(fileId) {
  const response = await fetch(`${IMAGEKIT_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthHeader(),
    },
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.message || 'Image delete failed')
  }
}

module.exports = {
  deleteImage,
  uploadImage,
}
