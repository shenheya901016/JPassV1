const webpack = require('webpack');
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    //引入jquery 使用
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
            })
        ]
    },
    devServer: {
        /*proxy: { // 配置跨域
            '/jsonrpc': {
                //要访问的跨域的api的域名
                target: 'http://139.198.191.254:8545/v1/jsonrpc',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/jsonrpc': ''
                }
            }
        }*/
        proxy: { // 配置跨域
            '/jsonrpc': {
                //要访问的跨域的api的域名
                target: 'http://139.198.191.254:8545/v1/jsonrpc',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/jsonrpc': ''
                }
            }
        }
    }
};
