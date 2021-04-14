const fs = require('fs')

const moveFiles = async (src, dest) => {
  return new Promise((resolve, reject) => {
    return fs.copyFile(src, dest, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

const removeFile = async (file) => {
  fs.unlinkSync(file, (err) => {
    if (err) console.log(err)
    console.log(`${file} was deleted`)
  })
}

module.exports = {
  moveFiles,
  removeFile
}
