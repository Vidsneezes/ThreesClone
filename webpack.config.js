var path = require('path');

var phaserModule = path.join(__dirname,'/node_modules/phaser/');
var phaser = path.join(phaserModule,'build/custom/phaser-split.js');
var pixi = path.join(phaserModule,'build/custom/pixi.js');
var p2 = path.join(phaserModule,'build/custom/p2.js');

var config = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname,'./'),
        filename: 'index.js',
    },
    devServer: {
        inline: true,
        port: 8080
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/,/public/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                    modules: true,
                    localIdentName: '[name]__[local]__[hash:base64:5]'
                }
            },
            {test: /pixi\.js/,loader: 'expose-loader?PIXI'},
            {test: /phaser-split\.js/,loader: 'expose-loader?Phaser'},
            {test: /p2\.js/,loader: 'expose-loader?p2'}
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi':pixi,
            'p2': p2
        }
    }
}

module.exports = config;