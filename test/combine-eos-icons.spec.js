const expect = require('chai').expect
const path = require('path')
const fs = require('fs')

const {
  combineIconsModels,
  showMissingOutlinedFiles,
  readFolderContent
} = require('../scripts/combine-eos-icons.js')
const { moveFiles } = require('./utils/files.util')

const testSettings = {
  models: [
    {
      src: '/models/abstract.json',
      dest: '/dummy-data/model/abstract.json'
    },
    {
      src: '/models/material/1k_plus.json',
      dest: '/dummy-data/model/material/1k_plus.json'
    }
  ],
  svgs: [
    // {
    //   src: '/svg-outlined/abstract.svg',
    //   dest: '/dummy-data/svg-outlined/abstract.svg'
    // },
    {
      src: '/svg/abstract.svg',
      dest: '/dummy-data/svg/abstract.svg'
    },
    {
      src: '/svg/material/1k_plus.svg',
      dest: '/dummy-data/svg/material/1k_plus.svg'
    },
    {
      src: '/svg-outlined/material/1k_plus.svg',
      dest: '/dummy-data/svg-outlined/material/1k_plus.svg'
    }
  ],
  targetDirEosModels: `./test/dummy-data/model/`,
  targetDirMdModels: './test/dummy-data/model/material/',
  destDirModels: './test/__temp__/mix-models.json'
}

describe('combine-eos-icons', function () {
  const {
    targetDirEosModels,
    targetDirMdModels,
    destDirModels,
    models,
    svgs
  } = testSettings

  before(function () {
    // Move needed models for the test
    models.map((ele) => {
      moveFiles(
        path.join(process.cwd() + ele.src),
        path.join(__dirname + ele.dest)
      )
    })

    // Moves needed svgs for the test
    svgs.map((ele) => {
      moveFiles(
        path.join(process.cwd() + ele.src),
        path.join(__dirname + ele.dest)
      )
    })
  })

  describe('combineIconsModels()', function (done) {
    before(function () {
      combineIconsModels({
        targetDirEos: targetDirEosModels,
        targetDirMd: targetDirMdModels,
        destDir: destDirModels
      }).then(done)
    })

    it('should generate a file that exists and, combines both models files in a single one', function () {
      const file1 = require(path.join(
        process.cwd() + testSettings.models[0].src
      ))
      const file2 = require(path.join(
        process.cwd() + testSettings.models[1].src
      ))

      // Get the combine output from the function
      const combineFile = require(path.join(
        process.cwd() + '/test/__temp__/mix-models.json'
      ))

      // Manually combine the files for comparation
      const mixingFiles = [file1, file2]
      expect(JSON.stringify(mixingFiles)).eql(JSON.stringify(combineFile))
    })
  })

  describe('showMissingOutlinedFiles()', async function (done) {
    before(function () {
      showMissingOutlinedFiles({
        normalSvgDir: './test/dummy-data/svg/',
        outlineSvgDir: './test/dummy-data/svg-outlined/',
        tempFolder: './test/__temp__/'
      }).then(done)
    })

    it('should move the missing abstract.svg file to the __temp__ folder', async function () {
      const file = fs.existsSync(
        path.join(process.cwd() + '/test/__temp__/abstract.svg')
      )

      expect(file).to.be.true
    })
  })

  describe('readFolderContent()', async function (done) {
    it('should be able to read a given .json file', async function () {
      const data = await readFolderContent(
        path.join(process.cwd() + '/test/dummy-data/model/')
      )
      expect(data.length).eql(1)
    })
  })
})
