const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSCSS = new ExtractTextPlugin('css/app.css');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //generuje html do analizy rozmiarow zasobow

let config = {
    entry: {
        "app": [
            path.resolve(__dirname, "client/src/scss/app.scss"),
            path.resolve(__dirname, "client/src/js/app.js"),
        ],
        "async-css": [  //Generowanie osobnego pliku z niezaleznymi css'ami
            path.resolve(__dirname, "client/src/scss/vendor.async.scss"),
        ]
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'client/public/')
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    plugins: ['lodash'], //optymalizuje biblioteke lodash w tym przypadku o 20KB
                    presets: ['es2015', 'stage-2', 'react']
                }
            },
            //Konsolidacja i konwersja plikow scss z postfixem async, pliki te będą ładowane asynchornicznie przez przegladarke
            {
                test: /async\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            //Konsolidacja i konwersja plikow scss i wygenrowanie pliku app.css
            {
                test: /\.scss$/,
                exclude: /async\.scss/,
                use: extractSCSS.extract({
                    // fallback: 'style-loader',
                    use: ['css-loader', /*'resolve-url-loader',*/ 'sass-loader']
                })
            },
            //Wyciąganie font'ow i wrzucenie ich do public/fonts*, w css'ach zostanie podmieniona sciezka do sciezki docelowej fontow
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: "[name].[ext]?[hash]",
                    publicPath: "/",
                    outputPath: "fonts/",
                }
            }
        ]
    },
    plugins: [
        extractSCSS,
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: path.resolve(__dirname, "client/public/webpack.html"),
            openAnalyzer: false
        }),
    ]
}

module.exports = config;