const expect = require('chai').expect

const { writeDuplicateSvgsTheme } = require('../scripts/svg-checker.js')
const {
  readFilesNameInFolder,
  readDirectoryFilesContent,
  readFileContent,
  compareObjects
} = require('../scripts/utilities')

describe.only('# models-checker', () => {
  let filled

  before(async () => {
    filled = readFilesNameInFolder('/svg/material/')
  })

  context('checkForMissingModelsOrIcons()', () => {
    it('should find missing models', async () => {
      // console.log('filled: ', filled.length);

      filled.slice(0, 1).map(async (ele) => {
        console.log('ele: ', ele)
        const reference = await readFileContent(`svg/material/${ele}.svg`)
        const outlined = await readFileContent(
          `svg-outlined/material/${ele}.svg`
        )

        const r = await compareObjects({ first: reference, second: outlined })
        console.log('r: ', r)
      })

      // console.log('outlined: ', outlined.length);
      expect(0).to.eql(0)
    })

    it('test when matches', async () => {
      const reference = await readFileContent(`svg/material/accessibility.svg`)
      const outlined = await readFileContent(
        `svg-outlined/material/accessibility.svg`
      )

      const r = await compareObjects({ first: reference, second: outlined })
      console.log('r: ', r)
    })
    it.only('DEMO', async () => {
      const d = await writeDuplicateSvgsTheme(filled)
      console.log('d: ', d.length)
    })
  })
})
