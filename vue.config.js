const webpack = require('webpack');
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    //引入jquery 使用
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    devServer: {
        proxy: { // 配置跨域
            '/ipfs': {
                //要访问的跨域的api的域名
                // target: 'http://192.168.2.13:1337',
                target: 'http://localhost:1337',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/ipfs': '/'
                }
            },
            '/alipay': {
                //要访问的跨域的api的域名
                target: 'http://47.103.65.5:9527/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/alipay': '/'
                }
            }
        }
    }
};
