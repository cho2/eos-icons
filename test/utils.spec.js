// Testing the utils functions
const expect = require('chai').expect
const { readFilesInFolder } = require('../scripts/utilities')

describe('# utils functions', () => {
  context('readFilesInFolder()', () => {
    it('should find one single svg and json file', async () => {
      const svg = readFilesInFolder('/test/dummy-data/persistent/svgs/')
      const json = readFilesInFolder('/test/dummy-data/persistent/json/')

      expect(svg[0]).to.eql('abstract_incomplete')
      expect(json[0]).to.eql('abstract_incomplete')
    })
  })
})
