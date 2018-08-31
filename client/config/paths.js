const path = require('path')
const url = require('url')
const fs = require('fs')

const envPublicUrl = process.env.PUBLIC_URL
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/')
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1)
  }
  if (!hasSlash && needsSlash) {
    return `${path}/`
  }
  return path
}

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage

const getClientEnvironmentVariables = publicUrl => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PUBLIC_URL: publicUrl
})

module.exports = {
  appIndex: resolveApp('src/index.tsx'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  appHtml: resolveApp('public/index.html'),
  appPublic: resolveApp('public'),
  appPackageJson: resolveApp('package.json'),
  appBuild: resolveApp('./build'),
  tsconfig: resolveApp('tsconfig.json'),
  devServedPath: resolveApp('.dev'),
  servedPath: getServedPath(resolveApp('package.json')),
  polyfills: resolveApp('config/polyfills'),
  getClientEnvironmentVariables
}
