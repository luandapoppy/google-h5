const path = require('path');
const webpack = require('webpack');
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const remain = JSON.parse(process.env.npm_config_argv).remain;
const remain = [];
const host = remain.length ? JSON.parse(process.env.npm_config_argv).remain[0].replace(/^--/, '') : 'default';

const domain = process.env.DOMAIN;

//开发环境下不单独提取css
const styleLoader = domain === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';


const os = require('os');
const networkInterfaces = os.networkInterfaces();


let ip = '';
for (var key in networkInterfaces) {
    networkInterfaces[key].forEach(item => {
        if (!item.internal && item.family === 'IPv4') {
            ip = item.address;
        }
    });
}


module.exports = {
    entry: {
        'index': [path.resolve('src/main.js')]
    },
    output: {
        publicPath: '/'
    },
    devServer: {
        host: '127.0.0.1',
        port: 8081,
        // quiet: true
        stats: "errors-only"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@': path.resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'components': path.resolve(__dirname, '../src/components'),
        }
    },
    externals: {
        "echarts": "echarts"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.resolve('src')
            ]
        },
        {
            test: /\.css$/,
            use: [
                styleLoader,
                "css-loader",
            ],
        },
        {
            test: /\.less$/,
            use: [
                styleLoader,
                "css-loader",
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        modifyVars: {
                            'hack': `true; @import "${path.resolve(__dirname, '../static/css/vant.less')}";`//vant主题自定义
                        }
                    }
                }
            ],
        },
        {
            test: /\.scss$/,
            use: [
                styleLoader,
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            // include: /images/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'static/asset/images/[hash:16].[ext]'
            }
        },
        {
            test: /\.(ttf|woff2?|eot|svg)$/,
            // include: /font/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'static/asset/fonts/[name].[hash:7].[ext]'
            }
        }]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    name: 'vendors/library',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                'vendors/vue-bucket': {
                    name: 'vendors/vue-bucket',
                    test: /[\\/]node_modules[\\/]vue/,
                    priority: -9
                },
                'vendors/echarts-bucket': {
                    name: 'vendors/echarts-bucket',
                    test: /[\\/]node_modules[\\/]echarts/,
                    priority: -9
                },
                'vendors/tfjs-bucket': {
                    name: 'vendors/tfjs-bucket',
                    test: /[\\/]node_modules[\\/]@tensorflow/,
                    priority: -9
                },
            }

        },
        runtimeChunk: {
            name: 'vendors/manifest',
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlPlugin({
            filename: 'index.html',
            template: path.resolve('index.html'),
            showErrors: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                domain: JSON.stringify(domain),
                host: JSON.stringify(host),
            },
        }),
        new CompressionWebpackPlugin({
            filename: info => {
                return `${info.path}.gz${info.query}`
            },
            algorithm: 'gzip',
            threshold: 10240, // 只有大小大于该值的资源会被处理 10240
            test: new RegExp('\\.(' + ['js'].join('|') + ')$'
            ),
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return {
                        'postcss-pxtorem': {
                            rootValue({ file }) {
                                // vant得设计稿是按照375设计的，而我们得设计稿是按照750来设计的，所以vant按37.5走，750的设计稿按75走，换算基准都是设计稿得十分之一，这是因为lib-flexible是将设计稿分为10分之一来做的适配
                                return file.indexOf('vant') !== -1 ? 37.5 : 41.4;
                            },
                            propList: ['*'],
                        },
                    }
                }
            }

        })
    ]
};
