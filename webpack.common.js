const webpack = require('webpack');

const config = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$i/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
          }
        ]
      },
      {
        test: /\.(j|t)sx?$i/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              casheDirectory: true,
              plugins: [
                '@babel/plugin-syntax-decorators',
                '@babel/plugin-syntax-jsx',
                'react-hot-loader/babel',
                [
                  'babel-plugin-styled-components',
                  {
                    displayName: process.env.NODE_ENV !== 'procuction'
                  }
                ]
              ]
            }
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ]
  },
  output: {
    publicPath: '/'
  },
  resolve: {
     alias: {
       "@cl": path.resolve(__dirname,'..','..', "client"),
     },
     extensions: [".mjs", ".ts", ".tsx", ".jsx", ".js", ".json"],
     modules: [
       path.resolve(__dirname,'..','..', "node_modules"),
     ],
   },
};

export default config;
