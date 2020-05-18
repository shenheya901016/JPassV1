let JPassUtil = require("jpass-util");
let request = require("request");

/*计算输入的字节*/
function strlen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        // 取出单个字符
        let c = str.charCodeAt(i);
        //单字节加1 ，0~9，a~z
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

const util = require('util');

let jcc_ipfs = {
    Ipfs: {
        /**
         * 写文件
         * @param secret 密钥
         * @param data  数据
         * @param md5   MD5加密
         * @param filePath  上传路径
         * @param timestamp 时间戳
         */
        write(secret, data, filePath) {
            let deriveKeyPair = JPassUtil.Wallet.deriveKeyPair(secret)
            let privateKey = deriveKeyPair.privateKey;
            let publicKey = deriveKeyPair.publicKey;
            let size = strlen(data);
            let md5 = "md5";
            let timestamp = new Date().getTime()
            let sign = JPassUtil.Wallet.sign(privateKey, md5 + size + filePath + timestamp)
            let options = {
                url: "http://localhost:1337/api/v0/write",
                qs: {//query
                },
                headers: {},//req.headers
                form: {// form-data
                    data: data,
                    size: size,
                    timestamp: timestamp,
                    md5: md5,
                    filePath: filePath,
                    publicKey: publicKey,
                    sign: sign,
                }  //req.body
                // body: filedata   // bin data
            };
            let a = 11;
            request.post(options, function (error, response, body) {
                //console.info('response:' + JSON.stringify(response));
                //console.info("statusCode:" + response.statusCode)
                console.info("statusCode:" + response.body)
            });
            console.info(a);
        },
        /**
         * 删除文件
         * @param secret 密钥
         * @param filePath 文件路径
         */
        remove(secret, filePath) {
            let deriveKeyPair = JPassUtil.Wallet.deriveKeyPair(secret)
            let privateKey = deriveKeyPair.privateKey;
            let publicKey = deriveKeyPair.publicKey;
            let timestamp = new Date().getTime();
            let sign = JPassUtil.Wallet.sign(privateKey, '' + '' + filePath + timestamp)
            let options = {
                url: 'http://localhost:1337/api/v0/remove',
                headers: {},
                form: {
                    filePath: filePath,
                    timestamp: timestamp,
                    sign: sign,
                    publicKey: publicKey
                }//req.body
            };

            request.post(options, function (error, response, body) {
                //console.info('response:' + JSON.stringify(response));
                //console.info("statusCode:" + response.statusCode)
                console.info(body);
            });
        },
        /**
         * 读取文件
         * @param filePath 文件路径
         * @param address 钱包地址
         */
        read(filePath, address) {
            let options = {
                url: 'http://localhost:1337/api/v0/read?filePath=' + filePath + '&address=' + address
            };
            request.get(options, function (err, response, body) {
                console.info(body);
            });
        },
        /**
         * 列出path下目录文件
         * @param path 路径 可以为空
         * @param address 钱包地址
         */
        list(path, address) {
            let options = {
                url: "http://localhost:1337/api/v0/list",
                qs: {//query
                },
                headers: {},//req.headers
                form: {// form-data
                    address: address,
                    path: path
                }  //req.body
                // body: filedata   // bin data
            };
            request.post(options, function (error, response, body) {
                //console.info('response:' + JSON.stringify(response));
                //console.info("statusCode:" + response.statusCode)
                console.info(body);
            });
        },
        async writeTest(secret, data, filePath) {
            let deriveKeyPair = JPassUtil.Wallet.deriveKeyPair(secret)
            let privateKey = deriveKeyPair.privateKey;
            let publicKey = deriveKeyPair.publicKey;
            let size = strlen(data);
            let md5 = "md5";
            let timestamp = new Date().getTime()
            let sign = JPassUtil.Wallet.sign(privateKey, md5 + size + filePath + timestamp)
            var url = "http://localhost:1337/api/v0/write";
            const getPromise = util.promisify(request.post);
            let result = await getPromise(url, {
                form: {
                    data: data,
                    size: size,
                    timestamp: timestamp,
                    md5: md5,
                    filePath: filePath,
                    publicKey: publicKey,
                    sign: sign,
                }
            });
            // 可以加入 try catch 捕获异常  也可以加 .catch()
            console.log(JSON.parse(result.body).status);
            return JSON.parse(result.body).status;
        }
    }
}
module.exports = jcc_ipfs;
