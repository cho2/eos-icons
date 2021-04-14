/**
 * Mocha's entry point.
 * We use this file to define and remove all files needes for the tests
 */
const path = require('path')

const { moveFiles, removeFile } = require('./utils/files.util')

const config = {
  models: [
    {
      src: '/models/abstract.json',
      dest: '/test/dummy-data/model/abstract.json'
    },
    {
      src: '/models/material/1k_plus.json',
      dest: '/test/dummy-data/model/material/1k_plus.json'
    }
  ],
  svgs: [
    // {
    //   src: '/svg-outlined/abstract.svg',
    //   dest: /'test/dummy-data/svg-outlined/abstract.svg'
    // },
    {
      src: '/svg/abstract.svg',
      dest: '/test/dummy-data/svg/abstract.svg'
    },
    {
      src: '/svg/material/1k_plus.svg',
      dest: '/test/dummy-data/svg/material/1k_plus.svg'
    },
    {
      src: '/svg-outlined/material/1k_plus.svg',
      dest: '/test/dummy-data/svg-outlined/material/1k_plus.svg'
    }
  ],
  targetDirEosModels: `./test/dummy-data/model/`,
  targetDirMdModels: './test/dummy-data/model/material/',
  destDirModels: './test/__temp__/mix-models.json'
}

const { models, svgs } = config

// before('', () => {
//   // Move needed models for the test
//   models.map((ele) => {
//     moveFiles(
//       path.join(process.cwd() + ele.src),
//       path.join(process.cwd() + ele.dest)
//     )
//   })

//   // Moves needed svgs for the test
//   svgs.map((ele) => {
//     moveFiles(
//       path.join(process.cwd() + ele.src),
//       path.join(process.cwd() + ele.dest)
//     )
//   })
// })

// TODO: Remove all files with extensions
// after('', () => {
//   // Removes models
//   models.map((ele) => {
//     removeFile(path.join(process.cwd() + ele.dest))
//   })

//   // Removes svgs
//   svgs.map((ele) => {
//     removeFile(path.join(process.cwd() + ele.dest))
//   })

//   removeFile(path.join(__dirname + '/__temp__/mix-models.json'))

//   removeFile(path.join(__dirname + '/__temp__/abstract.svg'))
// })

module.exports = {
  config
}
