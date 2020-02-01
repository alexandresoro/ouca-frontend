import webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebappWebpackPlugin = require("webapp-webpack-plugin");
const path = require("path");

module.exports = (env: any, argv: any): webpack.Configuration => {
  const isProductionMode = argv && argv.mode === "production";

  return {
    mode: isProductionMode ? "production" : "development",
    entry: {
      polyfills: "./src/polyfills.ts",
      app: "./src/main.ts"
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
      extensions: [".ts", ".js"]
    },

    // Source maps support ('inline-source-map' also works)
    devtool: isProductionMode ? false : "source-map",

    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true,
      proxy: {
        "/api": "http://localhost:4000"
      }
    },

    // Add the loader for .ts files.
    module: {
      rules: [
        {
          test: /\.ts$/,
          enforce: "pre",
          loader: "eslint-loader",
          options: {
            failOnError: true
          }
        },
        {
          test: /\.tsx?$/,
          loaders: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true
              }
            },
            "angular2-template-loader"
          ]
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: "file-loader?name=assets/[name].[hash].[ext]"
        },
        {
          test: /\.scss$/,
          exclude: [/styles\.scss$/],
          use: ["to-string-loader", "css-loader", "sass-loader"]
        },
        {
          test: /styles\.scss$/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin({}),
      new WebappWebpackPlugin("./src/assets/img/logo.svg"),
      // Workaround for angular/angular#11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /(.+)?angular(\\|\/)core(.+)?/,
        path.join(__dirname, "src"), // location of your src
        {} // a map of your routes
      ),
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash].js",
      chunkFilename: "[id].[hash].chunk.js"
    }
  };
};
