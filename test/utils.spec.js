// Testing the utils functions
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const {
  readFilesNameInFolder,
  readFilesContentInFolder,
  compareArrays,
  jsFileFromJSON
} = require('../scripts/utilities')

describe('# utils functions', () => {
  context('readFilesNameInFolder()', () => {
    it('should find one single svg and json file', async () => {
      const svg = readFilesNameInFolder('/test/dummy-data/persistent/svgs/')
      const json = readFilesNameInFolder('/test/dummy-data/persistent/json/')

      expect(svg[0]).to.eql('abstract_incomplete')
      expect(json[0]).to.eql('abstract_incomplete')
      expect(svg.length).to.eql(1)
      expect(json.length).to.eql(2)
    })
  })

  context('compareArrays()', () => {
    const array1 = ['item1', 'item2']
    const array2 = ['item1', 'item3']

    it('should return item2 as missing item from array2', async () => {
      const res = compareArrays(array1, array2)

      expect(res).to.be.length(1)
      expect(res[0]).to.eql('item2')
    })

    it('should return item3 as missing item from array1', async () => {
      const res = compareArrays(array2, array1)

      expect(res).to.be.length(1)
      expect(res[0]).to.eql('item3')
    })
  })

  context('jsFileFromJSON()', () => {
    before(async () => {
      await jsFileFromJSON(
        path.join(process.cwd(), '/test/__temp__/abstract.json'),
        path.join(process.cwd(), '/test/__temp__/abstract.js')
      )
    })

    it('should create an JS file from the JSON file.', async () => {
      const file = fs.existsSync(
        path.join(process.cwd() + '/test/__temp__/abstract.js')
      )

      expect(file).to.be.true
    })
  })

  context('readFilesContentInFolder()', () => {
    it('should be able to read the content of the .json files', async function () {
      const data = await readFilesContentInFolder('/test/dummy-data/model/')

      expect(data.length > 2).to.be.true
    })
  })
})