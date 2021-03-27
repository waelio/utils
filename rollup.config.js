export default [{
  input: 'src/store.js',
  output: {
    file: 'dist/store.js',
    format: 'cjs'
  }
}, {
  input: 'src/utils.js',
  output: [
    {
      file: 'dist/waelioUtils.js',
      format: 'cjs'
    },
    {
      file: 'dist/waelioUtils-umd.js',
      name: 'waelioUtils',
      format: 'umd'
    },
    {
      file: 'dist/waelioUtils-es.js',
      format: 'es'
    }
  ]
}];