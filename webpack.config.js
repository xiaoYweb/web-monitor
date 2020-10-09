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
    libraryTarget: 'umd',
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
      router.get('/success', function (req, res) {
        res.json({ id: 1 })
      })
      router.post('/error', function (req, res) {
        res.setStatus(500)
      })
    }
  }
}