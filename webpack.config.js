const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const includePath = path.join(__dirname, 'src');
const nodeModulesPath = path.join(__dirname, 'node_modules');

module.exports = env => {
  let mode = 'development';
  let outputPath = path.join(__dirname, 'build', 'dev');

  if (env.NODE_ENV === 'prod') {
    mode = 'production';
    outputPath = path.join(__dirname, 'build', 'prod');
  }

  return {
    entry: [
      './src/app.ts'
    ],
    mode,
    output: {
      path: outputPath,
      filename: 'app.js'
    },

    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: 'ts-loader',
          },
          include: includePath,
          exclude: nodeModulesPath,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        }
      ]
    },

    // options for resolving module requests
    // (does not apply to resolving to loaders)
    resolve: {
      // directories where to look for modules,
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ],

      // extensions that are used
      extensions: ['.ts', '.js'],
    },

    devServer: {
      contentBase: 'build/dev'
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
        filename: 'index.html'
      })
    ]
  };
};