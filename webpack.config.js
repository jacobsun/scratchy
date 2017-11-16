const Path = require('path')
const Webpack = require('webpack')
const ExtractText = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
let src = Path.resolve(__dirname, 'src')
let dist = Path.resolve(__dirname, 'dist')
let isProduction = process.env.NODE_ENV === 'production'
let config = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: dist,
    publicPath: '/dist/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': src,
      '~': Path.resolve(__dirname, 'node_modules')
    }
  },
  devServer: {
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext)]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext)]'
        }
      }
    ],
    noParse: /node_modules\/(jquey|moment|chart\.js)/
  },
  plugins: [
  ]
}

let devConfig = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
  ]
}

let proConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractText.extract({
          use: ['css-loader', 'postcss-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.styl$/,
        use: ExtractText.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'postcss-loader',
            'stylus-loader'
          ],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new Webpack.optimize.UglifyJsPlugin({
      test: /\.js$/,
      exclude: [/\.min\.js$/gi],
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: false,
        collapse_vars: true,
        reduce_vars: true
      }
    }),
    new ExtractText('css/app.css'),
    new OptimizeCssAssetsPlugin({
      safe: true
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function ({ resource }) {
        return resource &&
          resource.indexOf('node_modules') >= 0 &&
          resource.match(/\.js$/)
      }
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new Webpack.HashedModuleIdsPlugin()
  ]
}

if (isProduction) {
  config.module.rules = config.module.rules.concat(proConfig.module.rules)
  config.plugins = config.plugins.concat(proConfig.plugins)
  config.performance = { // performance budget 默认是250kb
    hints: 'warning', // 'error' or false are valid too
    maxEntrypointSize: 40000, // in bytes
    maxAssetSize: 450000 // in bytes
  }
} else {
  config.module.rules = config.module.rules.concat(devConfig.module.rules)
  config.plugins = config.plugins.concat(devConfig.plugins)
}

module.exports = config
