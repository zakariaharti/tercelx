import * as webpack from 'webpack';

const config: webpack.Configuration = {
  module: {
    rules: [
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
    extensions: ['.js','.jsx','ts','tsx','.json']
  }
};

export default config;
