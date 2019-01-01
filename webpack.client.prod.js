const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const CompressionPlugin = require('mini-css-extract-plugin');
const MiniCssExtractPlugin = require('compression-webpack-plugin');

const common = require('./webpack.common');

const config = merge(common,{
  mode: 'production',
  devtool: "source-map",
  entry: [
    path.resolve(__dirname,'..','..','client','index.tsx')
  ],
  output: {
    chunkFilename: "assets/js/[name].[chunkhash].js",
    filename: "assets/js/[name].[chunkhash].js",
    path: path.resolve(__dirname,'..','..','build','public')
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
             name: `assets/img/[name].[hash].[ext]`,
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
              name: `assets/fonts/[name].[hash].[ext]`,
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
      filename: "assets/css/[name].[contenthash].css",
    }),
    new CompressionPlugin({
      cache: true,
      minRatio: 0.99,
    }),
  ]
});

export default config;
