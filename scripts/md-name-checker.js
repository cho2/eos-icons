const fs = require('fs-extra')
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

/**
 * Filter out directories
 */
const isDirectory = (source) => lstatSync(source).isDirectory()
const getDirectories = async (source) =>
  readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory)

const readFiles = async (dir) => {
  /**
   * RegEx to match 24px icons only.
   */
  const regEx = /(.*)24px.svg/gm

  try {
    const icons = await fs.readdirSync(dir, (err, filenames) => filenames)

    /**
     * If the target is node_modules, we match the regex and we rename the icons by removing the ic_ prefix and _24px sufix
     */
    if (dir.includes('node_modules')) {
      return icons
        .filter((item) => item.match(regEx))
        .map((ele) => ele.replace('ic_', '').replace('_24px', ''))
    } else {
      return icons
    }
  } catch (error) {
    /* Filtr out the erros that are not -2: Folder not found */
    if (error.errno !== -2) {
      console.log('ERROR: readFiles() => : ', error)
    } else {
      return
    }
  }
}

const fetchIcons = async (mainDir) => {
  try {
    /* Get all the sub directory */
    const arrayOfFolders = await getDirectories(mainDir)

    let arr = []

    /* For each directory, we push the matched file_name to the empty array */
    for await (let ele of arrayOfFolders) {
      const data = await readFiles(`${ele}/svg/production`)
      arr.push(data)
    }

    /**
     * We combine all the arrays in a sigle array that contains all the files name.
     */
    return (arr = arr.reduce((a, b) => a.concat(b), []))
  } catch (error) {
    console.log('error: ', error)
  }
}

const compareFolders = async (params) => {
  const { mdRepo, eosRepo } = params

  try {
    /* Get the two arrays with the icons for md and eos */
    const mdIcons = await fetchIcons(mdRepo)
    const eosIcons = await readFiles(eosRepo)

    /**
     * We comparte the two arrays for matching names
     */
    const checkForMatchingIcon = mdIcons.filter((element) => {
      return eosIcons.includes(element)
    })

    /**
     * We return a warning or success message bases on the result
     */
    return checkForMatchingIcon.length >= 1
      ? {
          error: true,
          message: `⚠️  Duplicate name for: ${checkForMatchingIcon}`
        }
      : { error: false, message: `✅  No duplicates` }
  } catch (error) {
    console.log('ERROR: compareFolders() => : ', error)
  }
}

module.exports = {
  compareFolders
}
