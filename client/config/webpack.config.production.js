const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const paths = require('./paths')

const publicPath = paths.servedPath
const publicUrl = publicPath.slice(0, -1)

const babelOptions = {
  cacheDirectory: true,
  plugins: ['transform-class-properties'],
  presets: ['env', 'react'],
  retainLines: true
}
const PostCSSLoader = {
  loader: require.resolve('postcss-loader'),
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9' // React doesn't support IE8 anyway
        ],
        flexbox: 'no-2009'
      })
    ]
  }
}

module.exports = {
  mode: 'production',
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,

  entry: ['./config/polyfills.js', './src/index.tsx'],

  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    path: paths.appBuild,
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
  },

  module: {
    strictExportPresence: true,
    rules: [
      // {
      //   test: /(\.(js|jsx|mjs)$|\.ts(x?)$)/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         fix: false,
      //         configFile: '.eslintrc.js',
      //         eslintPath: 'eslint'
      //       },
      //       loader: 'eslint-loader'
      //     }
      //   ],
      //   exclude: /node_modules/
      // },
      {
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /(\.(js|jsx|mjs)$|\.ts(x?)$)/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: babelOptions
              },
              { loader: 'ts-loader', options: { happyPackMode: true } }
            ]
          },
          {
            exclude: paths.appSrc,
            test: [/\.css$/, /\.scss$/],
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: shouldUseSourceMap
                }
              },
              PostCSSLoader
            ]
          },
          {
            test: [/\.css$/, /\.scss$/],
            exclude: [paths.appNodeModules],
            include: [paths.appSrc],
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: shouldUseSourceMap,
                  modules: true,
                  import: false
                }
              },
              PostCSSLoader,
              {
                // process SASS/SCSS for every .css file
                loader: require.resolve('sass-loader')
              }
            ]
          },
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new CopyWebpackPlugin([{ from: paths.appPublic, to: paths.appBuild }]),

    new webpack.DefinePlugin(paths.getClientEnvironmentVariables(publicUrl)),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return
        }
        console.log(message)
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: `/index.html`,
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    }),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      checkSyntacticErrors: true
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  }
}
