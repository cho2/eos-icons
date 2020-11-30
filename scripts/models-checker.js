const fs = require('fs')

/* Function that takes an object with the models and icons source dir, ex: checkForMissingModelsOrIcons({ modelsSrc: './models/', iconsSrc: './svg', animatedSrc: './animated-svg' }) */
const checkForMissingModelsOrIcons = async (params) => {
  const { modelsSrc, mdModelsSrc, mdIconsSrc, iconsSrc, animatedSrc } = params

  try {
    /* Read both models and icons files names. */
    const existentModels = await readFilesAndCleanNames(modelsSrc)
    const existentIcons = await readFilesAndCleanNames(iconsSrc)
    const existentAnimatedIcons = await readFilesAndCleanNames(animatedSrc)
    const existentMdModels = await readFilesAndCleanNames(mdModelsSrc)
    const existentMdIcons = await readFilesAndCleanNames(mdIconsSrc)

    /* Compare one with the other and extract the missing models and icons  */
    const SVGsMissingModels = compareTwoArraysOfElements(
      [...existentModels, ...existentMdModels],
      [...existentIcons, ...existentMdIcons, ...existentAnimatedIcons]
    )
    const ModelsMissingSVGs = compareTwoArraysOfElements(
      [...existentMdIcons, ...existentIcons, ...existentAnimatedIcons],
      [...existentModels, ...existentMdModels]
    )

    /* Return an object with all the missing SVGs and Models */
    return { SVGsMissingModels, ModelsMissingSVGs }
  } catch (error) {
    console.log('ERROR: checkForMissingModelsOrIcons() => : ', error)
  }
}

/* Get the files(json or svg) from a folder and removes the.extension from them only leaving the names. */
const readFilesAndCleanNames = async (folder) => {
  try {
    const files = await fs.readdirSync(folder, (err, file) => {
      if (err) console.log(err)
      return file
    })

    /* We filter out the subfolder (or others elements in the future) */
    const filterContent = files.filter((ele) => {
      return ele.includes('.svg') || ele.includes('.json') ? ele : null
    })

    /* Return the files name without the extension */
    return filterContent.map((ele) => ele.split('.')[0])
  } catch (error) {
    console.log('ERROR: readFilesAndCleanNames() => : ', error)
  }
}

/* Compare two arrays and returns the extra elements that are not part of the first array */
const compareTwoArraysOfElements = (array1, array2) =>
  array1.filter((ele) => !array2.includes(ele) && ele !== 'extended')

/* ==========================================================================
  Models properties checking
  ========================================================================== */
const readModelKeys = async (params) => {
  const { modelsFolder } = params

  /* Get all files inside the models folder */
  const filesName = await fs.readdirSync(modelsFolder, (err, file) => {
    if (err) console.error(err)

    return file
  })

  const filterfiles = filesName.filter((ele) => {
    return ele.includes('.json') ? ele : null
  })

  /* For each file, read and parse the data */
  return filterfiles.map((ele) => {
    try {
      const fileData = fs.readFileSync(
        `${modelsFolder}/${ele}`,
        (err, data) => {
          if (err) console.error(err)

          return data
        }
      )

      return {
        fileName: ele,
        ...JSON.parse(fileData)
      }
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      if (error) throw `${ele}: ${error} `
    }
  })
}

/* Maps throught the array of objects checking for  */
const checkModelKeys = async () => {
  const modelsEos = await readModelKeys({ modelsFolder: './models' })
  const modelsMd = await readModelKeys({ modelsFolder: './models/material' })

  const modelsAll = [...modelsEos, ...modelsMd]
  const errors = []

  modelsAll.forEach((model) => {
    /* Make sure that the filename is eql to the models name */
    if (model.name !== model.fileName.split('.json')[0]) {
      errors.push(
        `\n⛔️  ${
          model.fileName
        } file name does not match models name property. Found: ${
          model.name
        } instead of ${model.fileName.split('.json')[0]}`
      )
    }

    /* Make sure there are tags in all models */
    if (model.tags.length < 1) {
      errors.push(`\n⛔️ Tags missing in: ${model.fileName}.`)
    }

    /* If a key is missing, add the error to the array */
    if (!checkForKeys(Object.keys(model))) {
      errors.push(
        `\n⛔️ Properties missing in: ${model.fileName}. Make sure it has: name, do, dont, tags, category, and type`
      )
    }
  })

  return errors
}

/* Checks an object to see if it matches the given keys in the array */
const checkForKeys = (model) => {
  return ['name', 'do', 'dont', 'tags', 'category', 'type'].every((key) =>
    model.includes(key)
  )
}

module.exports = {
  checkForMissingModelsOrIcons,
  checkModelKeys,
  readFilesAndCleanNames
}
