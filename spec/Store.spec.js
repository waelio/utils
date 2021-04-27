const { store, config, note, Notify } = require('../src')

describe('Store Plugin', () => {
  it('should store data', () => {
    store('test', 'testValue')
    const test = store('test')
    expect(test).toEqual('testValue')
  })
})

describe('Config Plugin', () => {
  it('should save data', () => {
    config.set('test', 'testValue')
    const test = config.get('test')
    expect(test).toEqual('testValue')
  })
})

describe('Note Plugin', () => {
  it('should display message', () => {
    let test
    try {
      test = null
      note.success('Test')
      note.info('Test')
      note.warning('Test')
      note.error('Test')
      note.log('Test')
    } catch (e) {
      test = e
    }
    expect(test).toEqual(null)
  })
})
