const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node', // Critical for VS Code extensions

  entry: {
    extension: './src/extension.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    // Alias helps avoid ".." hell, but relative paths work too
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/, // Don't compile libraries
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Use the local tsconfig
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },

  externals: {
    vscode: 'commonjs vscode', // Don't bundle VS Code itself
  },

  devtool: 'nosources-source-map',
};
