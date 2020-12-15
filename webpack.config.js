const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'WebMonitor',
    libraryTarget: 'var',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // inject: false,
      inject: 'head',
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9000,
    before(router) {
      router.post('/self/success', function (req, res) {
        res.statusCode = 202;
        res.json({ id: 1 })
      })
      router.post('/self/error', function (req, res) {
        res.statusCode = 403;
        res.statusMessage = 'Not found';
        res.end()
      })
    }
  }
}