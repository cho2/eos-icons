const fs = require('fs')

const moveFiles = async (src, dest) => {
  return new Promise((resolve, reject) => {
    return fs.copyFile(src, dest, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// TODO
const removeFile = async (src) => {}

module.exports = {
  moveFiles
}
