module.exports = {
  root: true,
  parser: 'babel-eslint',
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  plugins: [
    // 此插件用来识别.html 和 .vue文件中的js代码
    'html',
    // standard风格的依赖包
    'standard',
    // standard风格的依赖包
    'promise'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off'
  },
  env: {
    // 预定义的全局变量，这里是浏览器环境
    browser: true,
    node: true,
    es6: true

    // jquery: true

  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  }
}
