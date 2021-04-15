const expect = require('chai').expect

const {
  checkForMissingModelsOrIcons,
  readModelKeys,
  outlinedModelsChecker
} = require('../scripts/models-checker.js')
const { removeFile, moveFiles } = require('./utils/files.util')

describe.only('# models-checker', () => {
  context('checkForMissingModelsOrIcons()', () => {
    it('should find missing models', async () => {
      const result = await checkForMissingModelsOrIcons({
        modelsSrc: '/test/dummy-data/model',
        mdModelsSrc: '/test/dummy-data/model/material',
        mdIconsSrc: '/test/dummy-data/svg/material',
        iconsSrc: '/test/dummy-data/svg',
        animatedSrc: '/test/dummy-data/animated'
      })

      expect(result.SVGsMissingModelsEOS[0]).to.eql('ai')
      expect(result.SVGsMissingModelsEOS[1]).to.eql('commit')
      expect(result.ModelsMissingSVGsEos[0]).to.eql('loading')
    })

    context('readModelKeys', () => {
      it('should read the models keys and add add the extra fileName to it', async () => {
        const response = await readModelKeys({
          modelsFolder: '/test/dummy-data/model'
        })

        expect(response[0]).to.have.property('fileName')
      })
    })

    context('outlinedModelsChecker', () => {
      before(async () => {
        moveFiles(
          'test/dummy-data/persistent/json/abstract_incomplete.json',
          'test/__temp__/abstract_incomplete.json'
        )
        moveFiles(
          'test/dummy-data/persistent/svgs/abstract_incomplete.svg',
          'test/__temp__/abstract_incomplete.svg'
        )
      })

      it('should add the property of hasOutlined and dateOutlined to the model', async () => {
        await outlinedModelsChecker({
          outlineSvgDir: '/test/__temp__/',
          modelsFolder: '/test/__temp__/'
        })

        const modifiedFile = require('./__temp__/abstract_incomplete.json')
        const modifiedFile2 = require('./__temp__/abstract.json')

        expect(modifiedFile).to.have.property('hasOutlined')
        expect(modifiedFile).to.have.property('dateOutlined')
        expect(modifiedFile2).to.have.property('hasOutlined')
        expect(modifiedFile2).to.have.property('dateOutlined')
      })
    })
  })
})
