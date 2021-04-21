const fs = require('fs')
const path = require('path')

/**
 * Creates a JS file from JSON
 * @param {*} src file source
 * @param {*} dest file destination
 */
const jsFileFromJSON = async (src, dest) => {
  const icons = fs.readFileSync(src)

  return fs.writeFileSync(dest, `const eosIcons = ${icons}`)
}

/**
 * Returns an array of filenames from a given folder path
 * @param {*} dir relative (./) path to scan
 * @returns string[] => Array with all the filenames
 */
const readFilesNameInFolder = (dir) => {
  try {
    const icons = fs.readdirSync(
      path.join(process.cwd() + dir),
      (err, filenames) => {
        if (err) console.error(err)
        return filenames
      }
    )

    /* We filter out the subfolder (or others elements in the future) */
    const iconsContent = icons.filter((ele) => {
      return ele.includes('.svg') || ele.includes('.json') ? ele : null
    })

    /* Return the files name without the extension */
    return iconsContent.map((ele) => ele.split('.')[0])
  } catch (error) {
    /* Filtr out the erros that are not -2: Folder not found */
    console.log('ERROR: readFiles() => : ', error)
  }
}

/**
 * Returns an array of a mix of all models
 * @param {string} dir relative (./) path to scan
 * @returns string[] => Array with all documents
 */
const readFilesContentInFolder = async (dir) => {
  const data = []
  fs.readdirSync(path.join(process.cwd(), dir), (err, files) => {
    if (err) console.log(err)

    return files
  }).map((file) => {
    if (file.includes('.json')) {
      data.push(
        JSON.parse(
          fs.readFileSync(`${path.join(process.cwd(), dir)}${file}`, 'utf8')
        )
      )
    }
  })

  return data
}

/**
 * Compares two arrays and returns the missing item
 * @param {*} array1 first array that holds the item
 * @param {*} array2 second array to be compared against
 * @returns array with the missing items on array2
 */
const compareArrays = (array1, array2) =>
  array1.filter((val) => !array2.includes(val))

module.exports = {
  jsFileFromJSON,
  readFilesNameInFolder: readFilesNameInFolder,
  compareArrays,
  readFilesContentInFolder
}
