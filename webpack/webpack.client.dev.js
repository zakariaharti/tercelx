const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');

const config = merge(common,{
  mode: 'development',
  devtool: "inline-source-map",
  entry: [
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.resolve(__dirname,'client','index.tsx')
  ],
  output: {
    chunkFilename: 'client.bundle.js',
    filename: 'client.bundle.js',
    path: path.resolve(__dirname,'build','public')
  },
  module: {
    rules: [
      {
        test: /\.css$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
        ]
      },
      {
        test: /\.scss|sass$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.less$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            }
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
         {
           loader: "file-loader",
           options: {
             name: `assets/img/[name].[ext]`,
           },
         },
       ],
     },
     {
       test: /\.(woff|woff2|(o|t)tf|eot)$/i,
       use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/fonts/[name].[ext]`,
            },
          },
        ],
     }
    ]
  },
  node: {
    console: true,
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|s(c|a)ss|less)$i/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "assets/css/[id].css",
      filename: "assets/css/[name].css",
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      }
    }),
  ]
});

module.exports = config;
