const fs = require('fs')

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
    console.log('filterContent: ', filterContent);
    return filterContent.map(ele =>  ele.split('.')[0] )
  } catch (error) {
    console.log('ERROR: readFilesAndCleanNames() => : ', error);
  }
}

/* Compare two arrays and returns the extra elements that are not part of the first array */
const compareTwoArraysOfElements = (array1, array2) => array1.filter(ele => !array2.includes(ele) && ele !== 'extended' )

module.exports = {
  checkForMissingModelsOrIcons
}
