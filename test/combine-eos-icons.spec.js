const expect = require('chai').expect
const path = require('path')
const fs = require('fs')

const {
  combineIconsModels,
  showMissingOutlinedFiles,
  readFolderContent
} = require('../scripts/combine-eos-icons.js')

const { config } = require('./settings')

const constants = {
  targetDirEosModels: `./test/dummy-data/model/`,
  targetDirMdModels: './test/dummy-data/model/material/',
  destDirModels: './test/__temp__/mix-models.json'
}

describe('# combine-eos-icons', function () {
  const { targetDirEosModels, targetDirMdModels, destDirModels } = constants

  describe('combineIconsModels()', function (done) {
    before(function () {
      combineIconsModels({
        targetDirEos: targetDirEosModels,
        targetDirMd: targetDirMdModels,
        destDir: destDirModels
      }).then(done)
    })

    it('should generate a file that exists and, combines both models files in a single one', function () {
      const file1 = require(path.join(process.cwd() + config.models[0].src))
      const file2 = require(path.join(process.cwd() + config.models[2].src))
      const file3 = require(path.join(process.cwd() + config.models[3].src))
      const file4 = require(path.join(process.cwd() + config.models[4].src))

      // Get the combine output from the function
      const combineFile = require(path.join(
        process.cwd() + '/test/__temp__/mix-models.json'
      ))

      // Manually combine the files for comparation
      const mixingFiles = [file1, file2, file3, file4]
      expect(JSON.stringify(mixingFiles)).eql(JSON.stringify(combineFile))
    })
  })

  describe('showMissingOutlinedFiles()', function () {
    before(async function () {
      await showMissingOutlinedFiles({
        normalSvgDir: './test/dummy-data/svg/',
        outlineSvgDir: './test/dummy-data/svg-outlined/',
        tempFolder: './test/__temp__/'
      })
    })

    it('should move the missing abstract.svg file to the __temp__ folder', async function () {
      const file = fs.existsSync(
        path.join(process.cwd() + '/test/__temp__/abstract.svg')
      )

      expect(file).to.be.true
    })
  })

  describe('readFolderContent()', async function () {
    it('should be able to read the single .json file', async function () {
      const data = await readFolderContent(
        path.join(process.cwd() + '/test/dummy-data/model/')
      )

      expect(data.length > 2).to.be.true
    })
  })
})
