const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const babelOptions = {
  cacheDirectory: true,
  plugins: ['transform-class-properties'],
  presets: ['env', 'react'],
  retainLines: true
}
const StyleLintPlugin = require('stylelint-webpack-plugin')
const paths = require('./paths')

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

const publicUrl = ''

module.exports = {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'react-hot-loader/babel',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:3000',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    './config/polyfills.js',
    './src/index.tsx'
    // the entry point of our app
  ],

  output: {
    filename: 'bundle.js',
    // the output bundle

    path: path.resolve(__dirname, 'public'),
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
    // necessary for HMR to know where to load the hot update chunks

    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },

  devtool: 'inline-source-map',
  profile: true,
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
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: false
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
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  modules: true,
                  import: false,
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
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
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      PUBLIC_URL: publicUrl,
      templateParams: {
        PUBLIC_URL: publicUrl
      }
    }),

    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240

    new webpack.NamedModulesPlugin(),
    // Add module names to factory functions so they appear in browser profiler.

    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify('/public')
      }
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.

    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:

    new StyleLintPlugin({
      // options
      configFile: '.stylelintrc.js'
    }),

    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      checkSyntacticErrors: true,
      watch: [paths.appSrc], // optional but improves performance (fewer stat calls)
      tsconfig: paths.tsconfig
    })
  ],

  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    // public: '0.0.0.0:3000',
    // respond to 404s with index.html,
    proxy: {
      '/api/**': {
        target: 'http://localhost:3001'
      }
    },
    inline: true,
    contentBase: path.join(__dirname, '../public'),
    hot: true
    // enable HMR on the server
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  }
}
