import {IpfsRemote} from "ipfslib";

let JPassUtil = require("jpass-util")
let remote = new IpfsRemote({urls: ["/jsonrpc"]})

let myIpfs = {
    /**
     * 读取IPFS中的数据
     * @param userJID 用户钱包地址
     * @param userSecret 用户钱包私钥
     * @return {Promise<*>} 读取的数据
     */
    async read(userJID, userSecret) {
        let jt_tokensOf = await remote.TokensOf([userJID]);
        let jt_getTokenByHash = await remote.GetTokenByHash([jt_tokensOf.result.list[0].token]);
        return jt_getTokenByHash.result.Items[0].Value;
        /*let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
        //使用私钥解密数据
        let msg = JPassUtil.ECCCrypto.decryptWithPrivateKey(key.privateKey, jt_getTokenByHash.result.Items[0].Value);
        return msg*/
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
    async write(data, userJID, userSecret, operatorJID, operatorSecret) {//params:包括用户JID，运营商JID,用户JID私钥
        let jt_tokensOf = await remote.TokensOf([userJID]);
        await remote.RemoveToken([{
            from: userJID,
            to: operatorJID,
            secret: userSecret,
            token: jt_tokensOf.result.list[0].token,
        }]);
        let key = JPassUtil.Wallet.deriveKeyPair(userSecret);
        //使用公钥加密数据
        let encryptData = JPassUtil.ECCCrypto.encryptWithPublicKey(key.publicKey, data);
        console.log(encryptData);
        let createToken =
            '        {\n' +
            '            "from": "' + operatorJID + '",\n' +
            '            "to": "' + userJID + '",\n' +
            '            "secret": "' + operatorSecret + '",\n' +
            '            "token": {\n' +
            '                "info": "' + jt_tokensOf.result.list[0].info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "data",\n' +   //该属性的名称
            '                        "value": ' + data + '\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)]);
        return jt_createToken.result[0].transaction
    },
    /**
     * 查询钱包余额 是否被激活
     * @param {string} userJID 用户钱包
     * @return {string}返回"success"或"error"
     */
    async bal(userJID) {
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
    async tra(transaction) {
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
    async init(userJID, userSecret, operatorJID, operatorSecret) {
        let issueToken =
            '                {\n' +
            '                    "from": "' + userJID + '",\n' +   //用户JID
            '                    "to": "' + operatorJID + '",\n' +     //运营商JID
            '                    "secret": "' + userSecret + '",\n' +
            '                    "token_info": {\n' +       //token的定义信息
            '                        "name": "' + userJID + ':data",\n' +        //类erc721的token的名称
            '                        "symbol": "data",\n' +      //类erc721的token的简称
            '                        "total_supply": 100,\n' +      //该token的总供应量
            '                        "items": [\n' +        //定义该token的属性
            '                            {\n' +
            '                                "name": "data",\n' +        //该属性的名称
            '                                "type": "map",\n' +        //该属性的类型
            '                                "desc": "the data of the token"\n' +        //该属性描述, 可以为空
            '                            }\n' +
            '                        ]\n' +
            '                    }\n' +
            '                }';
        let result = (await remote.IssueToken([JSON.parse(issueToken)])).result[0];
        if (this.tra(result.transaction)) {
            let createToken =
                '        {\n' +
                '            "from": "' + operatorJID + '",\n' +
                '            "to": "' + userJID + '",\n' +
                '            "secret": "' + operatorSecret + '",\n' +
                '            "token": {\n' +
                '                "info": "' + result.token + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
                '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
                '                "items": [\n' +    //该token的属性
                '                    {\n' +
                '                        "name": "data",\n' +   //该属性的名称
                '                        "value": {"version":0}\n' +    //该属性的值，要符合jt_issueToken中的定义
                '                    }\n' +
                '                ]\n' +
                '            }\n' +
                '        }';
            let jt_createToken = await remote.CreateToken([JSON.parse(createToken)]);
            return jt_createToken.status
        }
    }
}
export default myIpfs;
