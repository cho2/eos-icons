const fs = require('fs')
const inquirer = require("inquirer");

/* Function that takes an object with the models and icons source dir, ex: checkForMissingModelsOrIcons({ modelsSrc: './models/', iconsSrc: './svg', animatedSrc: './animated-svg' }) */
const checkForMissingModelsOrIcons = async params => {
  const { modelsSrc, iconsSrc, animatedSrc } = params

  try {
    /* Read both models and icons files names. */
    const existentModels = await readFilesAndCleanNames(modelsSrc)
    const existentIcons = await readFilesAndCleanNames(iconsSrc)
    const existentAnimatedIcons = await readFilesAndCleanNames(animatedSrc)

    /* Compare one with the other and extract the missing models and icons  */
    const SVGsMissingModels = compareTwoArraysOfElements(existentModels, [...existentIcons, ...existentAnimatedIcons])
    const ModelsMissingSVGs = compareTwoArraysOfElements([...existentIcons, ...existentAnimatedIcons], existentModels)

    /* Return an object with all the missing SVGs and Models */
    return { SVGsMissingModels, ModelsMissingSVGs }
  } catch (error) {
    console.log('ERROR: checkForMissingModelsOrIcons() => : ', error);
  }
}

/* Get the files(json or svg) from a folder and removes the.extension from them only leaving the names. */
const readFilesAndCleanNames = async folder => {
  try {
    const files = await fs.readdirSync(folder, (err, file) => {
      if(err) console.log(err);
      return file
    })

    /* We filter out the subfolder (or others elements in the future) */
    const filterContent = files.filter(ele => {
      return ele.includes('.svg') || ele.includes('.json')
      ? ele
      : null
    })

    /* Return the files name without the extension */
    return filterContent.map(ele =>  ele.split('.')[0] )
  } catch (error) {
    console.log('ERROR: readFilesAndCleanNames() => : ', error);
  }
}

/* Compare two arrays and returns the extra elements that are not part of the first array */
const compareTwoArraysOfElements = (array1, array2) => array1.filter(ele => !array2.includes(ele) && ele !== 'extended' )

/* ==========================================================================
  Models proprietes checking
  ========================================================================== */
const readModelKeys = async params => {
  const { modelsFolder } = params

  /* Get all files inside the models golder */
  const filesName = await fs.readdirSync(modelsFolder, (err, file) => file)

  /* For each file, read and parse the data */
  return filesName.map(ele => {
    try {
      const fileData = fs.readFileSync(`models/${ele}`, (err, data) => data)

      return {
        fileName: ele,
        ...JSON.parse(fileData)
      }
    } catch (error) {
      if (error) throw `${ele}: ${error} `
    }
  })
}

/* Maps throught the array of objects checking for  */
const checkModelKeys = async () => {
  const models = await readModelKeys({ modelsFolder: './models' })

  return models.map(model => {
    return checkForKeys(Object.keys(model))
      ? undefined
      : model
  }).filter(item => item !== undefined)
}

/* Checks an object to see if it matches the given keys in the array */
const checkForKeys = model => {
  return ['name', 'do', 'dont', 'tags', 'category', 'type']
    .every(key => model.includes(key))
}

module.exports = {
  checkForMissingModelsOrIcons,
  checkModelKeys,
  readFilesAndCleanNames
};
