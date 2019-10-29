const fs = require('fs-extra')
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')


/* RegEx to match svg size */
const regEx = /(.*)24px.svg/gm

/* Filter out directories */
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = async source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const readFiles = async dir => {
  try {
    return  await fs.readdirSync(dir, (err, filenames) => filenames.filter(icon => icon.match(regEx)))
  } catch (error) {
    return
  }
}

// const filterd = matchFiles.map(ele => ele.replace('ic_', '').replace('_24px', '').replace('.svg', ''))

const fetchIcons = async mainDir => {
 try {
   /* Get all the directories inside md-repo */
   const arrayOfFolders = await getDirectories(mainDir)

   let arr = []

   for await (let ele of arrayOfFolders) {
    const data = await readFiles(`${ele}/svg/production`)
     arr.push(data)
   }

   return arr = arr.reduce((a, b) => a.concat(b), []);
 } catch (error) {
   console.log('error: ', error);
 }
}

const checkIcons = async params => {
  try {
    const { mdRepo, eosRepo } = params

    /* Get the array for md and eos icons */
    const mdIcons = await fetchIcons(mdRepo)
    const eosIcons = await readFiles(eosRepo)
    

    const checkForMatchingIcon = mdIcons.filter(element => {
      return eosIcons.includes(element )
    });

    return checkForMatchingIcon.length >= 1 ? `ERROR!: Duplicate name: ${checkForMatchingIcon}` : 'No duplicates'

  } catch (error) {
    console.log('ERROR: checkIcons() => : ', error);
  }
}

const mdRepo = './node_modules/material-design-icons'
const eosRepo = './svg'

checkIcons({ mdRepo, eosRepo }).then(d => console.log(d))

module.exports = {
  checkIcons
}
