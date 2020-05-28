let JPassUtil = require("jpass-util");
let request = require("request");
const util = require('util');

let baserpcurl = "http://localhost:1337";
//判断是否为开发者模式
if (process.env.NODE_ENV === "development") {
    baserpcurl = 'http://localhost:8080/ipfs';
}

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
        async write(secret, data, filePath) {
    let deriveKeyPair = JPassUtil.Wallet.deriveKeyPair(secret)
    let privateKey = deriveKeyPair.privateKey;
    let publicKey = deriveKeyPair.publicKey;
    let size = strlen(data);
    let md5 = "md5";
    let timestamp = new Date().getTime()
    let sign = JPassUtil.Wallet.sign(privateKey, md5 + size + filePath + timestamp);
    let url = baserpcurl+"/api/v0/write";
    const getPromise = util.promisify(request.post);
    let result = await getPromise(url, {'form':{// form-data
        data: data,
        size: size,
        timestamp: timestamp,
        md5: md5,
        filePath: filePath,
        publicKey: publicKey,
        sign: sign,
    }});  //req.body);
    // 可以加入 try catch 捕获异常  也可以加 .catch()
    // console.log("result" , result.body);
    return result.body
},
/**
 * 删除文件
 * @param secret 密钥
 * @param filePath 文件路径
 */
async remove(secret, filePath) {
    let deriveKeyPair = JPassUtil.Wallet.deriveKeyPair(secret)
    let privateKey = deriveKeyPair.privateKey;
    let publicKey = deriveKeyPair.publicKey;
    let timestamp = new Date().getTime();
    let sign = JPassUtil.Wallet.sign(privateKey, '' + '' + filePath + timestamp);
    const getPromise = util.promisify(request.post);
    let url = "http://localhost:8080/ipfs/api/v0/remove";
    let result = await getPromise(url, {form: {
        filePath: filePath,
        timestamp: timestamp,
        sign: sign,
        publicKey: publicKey
    }});
    // 可以加入 try catch 捕获异常  也可以加 .catch()
    console.log("result" , result.body);
},
/**
 * 读取文件
 * @param filePath 文件路径
 * @param address 钱包地址
 */
async read(filePath, address) {
    const getPromise = util.promisify(request.get);
    let url= baserpcurl+'/api/v0/read?filePath=' + filePath + '&address=' + address;
    let result = await getPromise(url);
    return result.body;
},
/**
 * 列出path下目录文件
 * @param path 路径 可以为空
 * @param address 钱包地址
 */
async list(path, address) {
    const getPromise = util.promisify(request.post);
    let url =baserpcurl+"/api/v0/list";
    let result=await getPromise(url, {form: {
        address: address,
        path: path
    }});
    console.log("result" , result.body);
},
}
}
module.exports = jcc_ipfs;
