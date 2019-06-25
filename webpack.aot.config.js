const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebappWebpackPlugin = require("webapp-webpack-plugin");
const path = require("path");
const AngularCompilerPlugin = require("@ngtools/webpack").AngularCompilerPlugin;

module.exports = (env, argv) => {
  return {
    mode: "production",
    entry: {
      polyfills: "./src/polyfills.ts",
      app: "./src/main.aot.ts"
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
      extensions: [".ts", ".js"]
    },

    // Add the loader for .ts files.
    module: {
      rules: [
        {
          test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
          use: "@ngtools/webpack"
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
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_HOST: JSON.stringify(
          argv && argv["backend-host"] ? argv["backend-host"] : "localhost"
        ),
        BACKEND_PORT: JSON.stringify(
          argv && argv["backend-port"] ? argv["backend-port"] : 4000
        )
      }),
      new AngularCompilerPlugin({
        tsConfigPath: path.join(process.cwd(), "tsconfig.aot.json"),
        entryModule: path.join(
          process.cwd(),
          "src/app/app.module.ts#AppModule"
        ),
        sourceMap: true
      }),
      new CleanWebpackPlugin({}),
      new WebappWebpackPlugin("./src/assets/img/logo.svg"),
      new HtmlWebpackPlugin({
        template: "src/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].[hash].css"
      })
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
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
