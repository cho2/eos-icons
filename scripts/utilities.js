const fs = require('fs')
const path = require('path')

// Creates a JS file from JSON
const jsFileFromJSON = async () => {
  const icons = fs.readFileSync('./dist/js/eos-icons.json')

  return fs.writeFileSync('./dist/js/eos-icons.js', `const eosIcons = ${icons}`)
}

/**
 * Returns an array of filenames from a given folder path
 * @param {*} dir relative (./) path to scan
 * @returns string[] => Array with all the filenames
 */
const readFilesInFolder = (dir) => {
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

module.exports = {
  jsFileFromJSON,
  readFilesInFolder
}
