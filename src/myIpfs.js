import {IpfsRemote} from "ipfslib";

let JPassUtil = require("jpass-util");
let baserpcurl = "http://139.198.191.254:8545/v1";
//判断是否为开发者模式
if (process.env.NODE_ENV === "development") {
    baserpcurl = '';
}

let remote = new IpfsRemote({urls: [baserpcurl + "/jsonrpc"]});

let myIpfs = {
    /**
     * 读取IPFS中的数据
     * @param userJID 用户钱包地址
     * @param userSecret 用户钱包私钥
     * @return {Promise<*>} 读取的数据
     */
    async read(userJID, userSecret) {
        let jt_tokensOf = await remote.TokensOf([userJID]);
        for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
            if (jt_tokensOf.result.list[i].symbol === 'data') {
                return await this.readByHash(jt_tokensOf.result.list[i].token, userSecret);
            }
        }
    },
    /**
     * 根据hash，查找图片
     * @param token 图片hash
     * @param userSecret 用户秘钥
     * @return {Promise<*|string>}
     */
    async readByHash(token, userSecret) {
        let jt_getTokenByHash = await remote.GetTokenByHash([token]);
        let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
        //使用私钥解密数据
        let msg = JPassUtil.ECCCrypto.decryptWithPrivateKey(key.privateKey, jt_getTokenByHash.result.Items[0].Value);
        return msg;
    },
    /**
     * 向IPFS中写入数据
     * @param data 数据
     * @param userJID 用户钱包地址
     * @param userSecret 用户钱包秘钥
     * @param operatorJID 运营商钱包地址
     * @param operatorSecret 运营商钱包秘钥
     * @return {Promise<void>} 返回判断是否已同步所需的参数
     */
    async write(type, data, userJID, userSecret, operatorJID, operatorSecret) {//params:包括用户JID，运营商JID,用户JID私钥
        let jt_tokensOf = await remote.TokensOf([userJID]);
        if (type === 'data') {
            for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
                if (jt_tokensOf.result.list[i].symbol === 'data') {
                    await remote.RemoveToken([{
                        from: userJID,
                        to: operatorJID,
                        secret: userSecret,
                        token: jt_tokensOf.result.list[i].token,
                    }]);
                    let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                    //使用公钥加密数据
                    let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, data);
                    return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_tokensOf.result.list[i].info, JSON.stringify(encryptData));
                }
            }
        } else if (type === 'file') {
            for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
                if (jt_tokensOf.result.list[i].symbol === 'file') {
                    let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                    //使用公钥加密数据
                    let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, data);
                    return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_tokensOf.result.list[i].info, JSON.stringify(encryptData));
                }
            }
        }
    },
    /**
     * 查询钱包余额 是否被激活
     * @param {string} userJID 用户钱包
     * @return {string}返回"success"或"error"
     */
    async getWalletBalance(userJID) {
        let balance = await remote.GetBalance([userJID]);
        if (balance.status === "success") {
            if (balance.result.balance >= 11000000) {
                return balance.status
            }
            return "error"
        } else {
            return balance.status
        }
    },
    /**
     * 查询某个交易详情信息
     * @param transaction 交易hash
     * @return {string}即可激活
     */
    async getTransactionStat(transaction) {
        let getTransaction = await remote.GetTransactionByHash([transaction]);
        if (getTransaction.status === "success") {
            return getTransaction.status
        } else {
            return await this.tra(transaction)
        }
    },
    /**
     * 初始化用户数据
     * @param {string} userJID 用户钱包地址
     * @param userSecret 用户钱包秘钥
     * @param operatorJID 运营商钱包地址
     * @param operatorSecret 运营商钱包秘钥
     * @return {string}
     */
    async init(type, userJID, userSecret, operatorJID, operatorSecret) {
        let jt_issueToken = await this.getIssueToken(userJID, userSecret, operatorJID, operatorSecret, type);
        if (jt_issueToken.status === "success") {
            if (await this.tra(jt_issueToken.result[0].transaction) === "success") {
                let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                //使用公钥加密数据
                let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, "{'version':'0'}");
                return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_issueToken.result[0].hash, JSON.stringify(encryptData))
            }
        }
    },
    async getIssueToken(userJID, userSecret, operatorJID, operatorSecret, type) {
        let issueToken =
            '                {\n' +
            '                    "from": "' + userJID + '",\n' +   //用户JID
            '                    "to": "' + operatorJID + '",\n' +     //运营商JID
            '                    "secret": "' + userSecret + '",\n' +
            '                    "token_info": {\n' +       //token的定义信息
            '                        "name": "' + userJID + ':' + type + '",\n' +        //类erc721的token的名称
            '                        "symbol": "' + type + '",\n' +      //类erc721的token的简称
            '                        "total_supply": 100,\n' +      //该token的总供应量
            '                        "items": [\n' +        //定义该token的属性
            '                            {\n' +
            '                                "name": "' + type + '",\n' +        //该属性的名称
            '                                "type": "map",\n' +        //该属性的类型
            '                                "desc": "the ' + type + ' of the token"\n' +        //该属性描述, 可以为空
            '                            }\n' +
            '                        ]\n' +
            '                    }\n' +
            '                }';
        let jt_issueToken = await remote.IssueToken([JSON.parse(issueToken)]);
        return jt_issueToken;
    },
    async getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, info, data) {
        let createToken =
            '        {\n' +
            '            "from": "' + operatorJID + '",\n' +
            '            "to": "' + userJID + '",\n' +
            '            "secret": "' + operatorSecret + '",\n' +
            '            "token": {\n' +
            '                "info": "' + info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "' + type + '",\n' +   //该属性的名称
            '                        "value": ' + data + '\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)]);
        return jt_createToken;
    },
    async initTest(userJID, userSecret, operatorJID, operatorSecret, type) {
        let jt_issueToken = await this.getIssueToken(userJID, userSecret, operatorJID, operatorSecret, type);
        if (jt_issueToken.status === "success") {
            if (await this.tra(jt_issueToken.result[0].transaction) === "success") {
                let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                //使用公钥加密数据
                let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, "{'base64':''}");
                return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_issueToken.result[0].hash, JSON.stringify(encryptData))
            }
        }
    },
    async readTest(userJID, userSecret) {
        let jt_tokensOf = await remote.TokensOf([userJID]);
        for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
            if (jt_tokensOf.result.list[i].symbol === 'data') {
                return await this.readByHash(jt_tokensOf.result.list[i].token, userSecret);
            }
        }
    },
    async writeTest(type, data, userJID, userSecret, operatorJID, operatorSecret) {
        let jt_tokensOf = await remote.TokensOf([userJID]);
        if (type === 'data') {
            for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
                if (jt_tokensOf.result.list[i].symbol === 'data') {
                    await remote.RemoveToken([{
                        from: userJID,
                        to: operatorJID,
                        secret: userSecret,
                        token: jt_tokensOf.result.list[i].token,
                    }]);
                    let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                    //使用公钥加密数据
                    let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, data);
                    return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_tokensOf.result.list[i].info, JSON.stringify(encryptData));
                }
            }
        } else if (type === 'file') {
            for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
                if (jt_tokensOf.result.list[i].symbol === 'file') {
                    let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
                    //使用公钥加密数据
                    let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, data);
                    return await this.getCreateToken(userJID, userSecret, operatorJID, operatorSecret, type, jt_tokensOf.result.list[i].info, JSON.stringify(encryptData));
                }
            }
        }
    }
};
export default myIpfs;
