const Webpack = require('webpack')

const WebpackDevServer = require('webpack-dev-server')

const config = require('../config/webpack.config.dev')

const compiler = Webpack(config)
const devServerOptions = Object.assign({}, config.devServer, {
  stats: {
    colors: true
  }
})

const devServer = new WebpackDevServer(compiler, devServerOptions)

devServer.listen('3000', 'localhost', err => {
  console.log('Starting server on http://localhost:3000')
  if (err) {
    return console.log(err)
  }
  return null
})
