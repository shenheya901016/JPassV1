import {IpfsRemote} from "ipfslib";

let remote = new IpfsRemote({urls: ["http://139.198.191.254:8545/v1/jsonrpc"]})

let MyIpfs = {
    async read(params) {//用户JID
        let jt_tokensOf = await remote.TokensOf(params)
        let jt_getTokenByHash = await remote.GetTokenByHash([jt_tokensOf.result.list[0].token]);
        return jt_getTokenByHash.result.Items[0].Value
    },
    async write(data, params) {//params:包括用户JID，运营商JID,用户JID私钥
        let jt_tokensOf = await remote.TokensOf(params)
        let jt_removeToken = await remote.RemoveToken([{
            from: "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",
            to: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",
            secret: "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h",
            token: jt_tokensOf.result.list[0].token,
        }])
        let createToken =
            '        {\n' +
            '            "from": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +
            '            "to": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +
            '            "secret": "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",\n' +
            '            "token": {\n' +
            '                "info": "' + jt_tokensOf.result.list[0].Info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "data",\n' +   //该属性的名称
            '                        "value": ' + data + '\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)])
        return jt_createToken.status
    },
    /**
     * 查询钱包余额 是否被激活
     * @param {string[]} params 用户钱包
     * @return {返回"success"、"error"}
     */
    async bal(params) {
        let balance = await remote.GetBalance(params)
        if (balance.status === "success") {
            if (balance.result.balance > 11000000) {
                return balance.status
            }
            return "error"
        } else {
            return balance.status
        }
    },
    /**
     * 查询某个交易详情信息
     * @param {string} params 交易hash
     * @return {操作后信息}即可激活
     */
    async tra(transaction) {
        let getTransaction = await remote.GetTransactionByHash(transaction)
        if (getTransaction.status === "success") {
            return getTransaction.status
        } else {
            return getTransaction.status
        }
    },
    /**
     * 初始化用户数据
     * @param {string} params 用户钱包
     * @return {操作后信息}
     */
    async init(params) {
        let issueToken =
            '                {\n' +
            '                    "from": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +   //用户JID
            '                    "to": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +     //运营商JID
            '                    "secret": "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h",\n' +
            '                    "token_info": {\n' +       //token的定义信息
            '                        "name": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL:data",\n' +        //类erc721的token的名称
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
        let token = (await remote.IssueToken([JSON.parse(issueToken)])).result[0].hash
        let createToken =
            '        {\n' +
            '            "from": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +
            '            "to": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +
            '            "secret": "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",\n' +
            '            "token": {\n' +
            '                "info": "' + token + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "data",\n' +   //该属性的名称
            '                        "value": {}\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)])
        return jt_createToken.status
    },
    /**
     * 查询用户所有上传IPFS数据
     * @param {string} params 用户JID
     * @return {返回所有数据}
     */
    async sel(params) {
        let models;
        let profile;
        let project;
        let jt_tokensOf = await remote.TokensOf(params)
        for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
            let jt_getTokenByHash = await remote.GetTokenByHash([jt_tokensOf.result.list[i].token]);
            for (let key in jt_getTokenByHash.result.Items[0].Value) {
                if (key == "models") {
                    models = jt_getTokenByHash.result.Items[0].Value.models;
                    console.log(models);
                } else if (key == "project") {
                    project = jt_getTokenByHash.result.Items[0].Value.project;
                    console.log(project);
                } else {
                    profile = jt_getTokenByHash.result.Items[0].Value.profile;
                    console.log(profile);
                }
            }
        }
        return {models, profile, project}
    },
    /**
     * 上传用户数据到IPFS
     * @param {string} data 用户要上传到IPFS的数据
     * @param {string} type 用户要上传到IPFS数据的类型
     * @param {string} params IPFS所需要参数
     * @return {返回所有上传后的信息}
     */
    async add(data, type, params) {
        let jt_tokensOf = await remote.TokensOf(params)
        let tokenOfHash;
        //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
        for (var i = 0; i < jt_tokensOf.result.list.length; i++) {//找出与type相同的symbol的tokenOfHash
            if (jt_tokensOf.result.list[i].symbol == type) {
                tokenOfHash = jt_tokensOf.result.list[i];
                console.log(tokenOfHash);
                break;
            }
        }
        let jt_getTokenByHash = await remote.GetTokenByHash([tokenOfHash.token]);
        let oldData;
        if (type == 'profile') {
            oldData = jt_getTokenByHash.result.Items[0].Value.profile;
        } else if (type == 'models') {
            oldData = jt_getTokenByHash.result.Items[0].Value.models;
        } else {
            oldData = jt_getTokenByHash.result.Items[0].Value.project;
        }
        let newData = "";
        if (oldData == undefined || oldData == "") {
            newData = data;
        } else {
            for (let i = 0; i < oldData.length; i++) {
                if (i == 0) {
                    newData += JSON.stringify(oldData[i]);
                } else {
                    newData += ',' + JSON.stringify(oldData[i]);
                }
            }
            newData += ',' + data;
        }
        console.log(newData);
        let jt_removeToken = await remote.RemoveToken([{
            from: "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",
            to: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",
            secret: "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h",
            token: jt_getTokenByHash.result.Hash,
        }])
        console.log(jt_removeToken)
        let createToken =
            '        {\n' +
            '            "from": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +
            '            "to": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +
            '            "secret": "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",\n' +
            '            "token": {\n' +
            '                "info": "' + jt_getTokenByHash.result.Info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "' + type + '",\n' +   //该属性的名称
            '                        "value": {\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                            "' + type + '": [\n' +
            newData + '\n' +
            '                            ]\n' +
            '                        }\n' +
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)])
    },
    /**
     * 删除用户要删除的数据
     * @param {string} data 用户要删除的数据
     * @param {string} type 用户要删除数据的类型
     * @param {string} params IPFS所需要参数
     * @return {操作后信息}
     */
    async del(data, type, params) {
        let jt_tokensOf = await remote.TokensOf(params)
        let tokenOfHash;
        //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
        for (var i = 0; i < jt_tokensOf.result.list.length; i++) {//找出与type相同的symbol的tokenOfHash
            if (jt_tokensOf.result.list[i].symbol == type) {
                tokenOfHash = jt_tokensOf.result.list[i];
                console.log(tokenOfHash);
                break;
            }
        }
        let jt_getTokenByHash = await remote.GetTokenByHash([tokenOfHash.token]);
        let oldData;
        if (type == 'profile') {
            oldData = jt_getTokenByHash.result.Items[0].Value.profile;
        } else if (type == 'models') {
            oldData = jt_getTokenByHash.result.Items[0].Value.models;
        } else {
            oldData = jt_getTokenByHash.result.Items[0].Value.project;
        }
        let newData = "";
        let n = 1;
        for (let i = 0; i < oldData.length; i++) {
            if (oldData[i].id != JSON.parse(data).id) {
                if (n == 1) {
                    newData += JSON.stringify(oldData[i]);
                } else {
                    newData += ',' + JSON.stringify(oldData[i]);
                }
                n++;
            }
        }
        console.log(newData);
        let jt_removeToken = await remote.RemoveToken([{
            from: "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",
            to: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",
            secret: "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h",
            token: jt_getTokenByHash.result.Hash,
        }])
        console.log(jt_removeToken)
        let createToken =
            '        {\n' +
            '            "from": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +
            '            "to": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +
            '            "secret": "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",\n' +
            '            "token": {\n' +
            '                "info": "' + jt_getTokenByHash.result.Info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "' + type + '",\n' +   //该属性的名称
            '                        "value": {\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                            "' + type + '": [\n' +
            newData + '\n' +
            '                            ]\n' +
            '                        }\n' +
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)])
    },
    /**
     * 修改用户的数据
     * @param {string} data 用户要修改的数据
     * @param {string} type 用户要修改数据的类型
     * @param {string} params IPFS所需要参数
     * @return {操作后信息}
     */
    async upd(data, type, params) {
        let jt_tokensOf = await remote.TokensOf(params)
        let tokenOfHash;
        //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
        for (var i = 0; i < jt_tokensOf.result.list.length; i++) {//找出与type相同的symbol的tokenOfHash
            if (jt_tokensOf.result.list[i].symbol == type) {
                tokenOfHash = jt_tokensOf.result.list[i];
                console.log(tokenOfHash);
                break;
            }
        }
        let jt_getTokenByHash = await remote.GetTokenByHash([tokenOfHash.token]);
        let oldData;
        if (type == 'profile') {
            oldData = jt_getTokenByHash.result.Items[0].Value.profile;
        } else if (type == 'models') {
            oldData = jt_getTokenByHash.result.Items[0].Value.models;
        } else {
            oldData = jt_getTokenByHash.result.Items[0].Value.project;
        }
        let newData = "";
        for (let i = 0; i < oldData.length; i++) {
            if (oldData[i].id == JSON.parse(data).id) {
                oldData[i] = JSON.parse(data);
            }
            if (i == 0) {
                newData += JSON.stringify(oldData[i]);
            } else {
                newData += ',' + JSON.stringify(oldData[i]);
            }
        }
        console.log(newData);
        let jt_removeToken = await remote.RemoveToken([{
            from: "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",
            to: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",
            secret: "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h",
            token: jt_getTokenByHash.result.Hash,
        }])
        console.log(jt_removeToken)
        let createToken =
            '        {\n' +
            '            "from": "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",\n' +
            '            "to": "j4M4AoSi522XxNpywfyBahmjzQihc4EegL",\n' +
            '            "secret": "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",\n' +
            '            "token": {\n' +
            '                "info": "' + jt_getTokenByHash.result.Info + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
            '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
            '                "items": [\n' +    //该token的属性
            '                    {\n' +
            '                        "name": "' + type + '",\n' +   //该属性的名称
            '                        "value": {\n' +    //该属性的值，要符合jt_issueToken中的定义
            '                            "' + type + '": [\n' +
            newData + '\n' +
            '                            ]\n' +
            '                        }\n' +
            '                    }\n' +
            '                ]\n' +
            '            }\n' +
            '        }';
        let jt_createToken = await remote.CreateToken([JSON.parse(createToken)])
    }
}

export default MyIpfs;
