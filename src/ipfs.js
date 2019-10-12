"use strict";

let url = "/jsonrpc";
let userJID = "j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
let operatorJID = "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS";
let userSecret="sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h";
let operatorSecret="ssxWidEVcs6bCtsVbfd7gMXUoRfMW";
let models = "";
let project = "";
let profile = "";
var $ = require("jquery");

let IpfsUtil = {
    Ipfs: {
        /**
         * 初始化参数
         * @param {string} userJid 用户JID
         * @param {string} operatorJIid 运营商JID
         */
        init(userJid, operatorJIid) {
            userJID = userJid;
            operatorJID = operatorJIid;
        },
        /**
         * 查找所有信息
         * @returns {arr:所有信息}
         */
        selAll(userJID) {
            let jt_tokensOf = jt_tokensOfs(userJID);
            console.log(jt_tokensOf);
            for (let i = 0; i < jt_tokensOf.result.list.length; i++) {
                let jt_getTokenByHash = jt_getTokenByHashs(jt_tokensOf.result.list[i].token);
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
            let arr = {models, project, profile};
            console.log(arr);
            return arr;
        },
        /**
         * 向IPFS上传数据
         * @param {string} data 上传数据
         * @param {string} type 数据类型
         * @returns {上传后的返回值}
         */
        add(data, type) {
            let jt_tokensOf = jt_tokensOfs(userJID);
            if (jt_tokensOf.status == "success") {
                let tokenOfHash;
               //console.log(jt_tokensOf);
                //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
                for (var i = 0; i < jt_tokensOf.result.list.length; i++) {//找出与type相同的symbol的tokenOfHash
                    if (jt_tokensOf.result.list[i].symbol == type) {
                        tokenOfHash = jt_tokensOf.result.list[i];
                        break;
                    }
                }
                if (tokenOfHash == undefined) {
                    //let jt_issueToken = jt_issueToken(type); //时间过长
                    //let jt_createToken = jt_createToken(jt_issueToken.result[0].hash, data, type);
                    //return jt_createToken;
                } else {
                    //找出原先保存在ipfs中的总数据
                    let jt_getTokenByHash = jt_getTokenByHashs(tokenOfHash.token);
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
                    //console.log(newData);
                    jt_removeTokens(tokenOfHash.token);
                    jt_createTokens(tokenOfHash.info, type, newData);
                }
            } else {
                //let jt_issueToken = jt_issueToken(type); //时间过长
                //let jt_createToken = jt_createTokens(jt_issueToken.result[0].hash, type, data);
                //return jt_createToken;
            }
        },
        /**
         * 删除IPFS中的数据
         * @param {string} data 要删除的数据
         * @param {string} type 数据类型
         * @returns {删除后的返回值}
         */
        del(data, type) {
            let jt_tokensOf = jt_tokensOfs(userJID);
            let tokenOfHash;
            //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
            for (var i = 0; i < jt_tokensOf.result.length; i++) {//找出与type相同的symbol的tokenOfHash
                if (jt_tokensOf.result[i].symbol == type) {
                    tokenOfHash = jt_tokensOf.result[i];
                    break;
                }
            }
            //找出原先保存在ipfs中的总数据
            let jt_getTokenByHash = jt_getTokenByHashs(tokenOfHash.token);
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
            jt_removeToken(tokenOfHash.token);
            let jt_createToken = jt_createToken(tokenOfHash.info, type, newData);
            return jt_createToken;
        },
        /**
         * 向IPFS更新数据
         * @param {string} data 要跟新的数据
         * @param {string} type 数据类型
         * @returns {更新后的返回值}
         */
        upd(data, type) {
            let jt_tokensOf = jt_tokensOf(userJID);
            let tokenOfHash;
            //tokenOfHashList.result的情况：1.[]内容为空(暂时无这种情况)  2.没有与type相同的symbol  3.有与type相同的symbol
            for (var i = 0; i < jt_tokensOf.result.length; i++) {//找出与type相同的symbol的tokenOfHash
                if (jt_tokensOf.result[i].symbol == type) {
                    tokenOfHash = jt_tokensOf.result[i];
                    break;
                }
            }
            //找出原先保存在ipfs中的总数据
            let jt_getTokenByHash = jt_getTokenByHash(tokenOfHash.token);
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
            jt_removeToken(tokenOfHash.token);
            let jt_createToken = jt_createToken(tokenOfHash.info, type, newData);
            return jt_createToken;
        },
        /**
         * 查找某个类型的所有数据
         * @param {string} type 要查找数据的类型
         * @returns {返回要查找数据的所有内容}
         */
        sel(type) {
            let jt_tokensOf = jt_tokensOf(userJID);
            let tokenOfHash;
            for (var i = 0; i < jt_tokensOf.result.length; i++) {//找出与type相同的symbol的tokenOfHash
                if (jt_tokensOf.result[i].symbol == type) {
                    tokenOfHash = jt_tokensOf.result[i];
                    break;
                }
            }
            //找出原先保存在ipfs中的总数据
            let jt_getTokenByHash = jt_getTokenByHash(tokenOfHash.token);
            return jt_getTokenByHash.result.Items[0].Value;
        },
        test(userJID){
            let tokensOf = '{\n' +
                '    "jsonrpc": "2.0",\n' +
                '    "method": "jt_tokensOf",\n' +
                '    "params": [\n' +
                '		"' + userJID + '"\n ' +
                '    ],\n' +
                '    "id": 1\n' +
                '}';
            var data1;
            $.ajax({
                type: "post",
                url: url,
                async: false,  //使用同步的方式,true为异步方式
                dataType: "json",
                data: tokensOf,
                success: function (data) {
                    data1=data;
                },
                error: function (data) {
                    data1=data;
                }
            });
            return data1;
        }
    }
}

function jt_tokensOfs(userJID) {
    let tokensOf = '{\n' +
        '    "jsonrpc": "2.0",\n' +
        '    "method": "jt_tokensOf",\n' +
        '    "params": [\n' +
        '		"' + userJID + '"\n ' +
        '    ],\n' +
        '    "id": 1\n' +
        '}';
    let jt_tokensOf;
    $.ajax({
        type: "post",
        url: url,
        async: false,  //使用同步的方式,true为异步方式
        data: tokensOf,
        dataType: "json",
        success: function (data) {
            jt_tokensOf = data;
        },
        error: function (data) {
            jt_tokensOf = data;
        }
    });
    return jt_tokensOf;
}

function jt_issueToken(type) {
    let issueToken = '{\n' +
        '            "jsonrpc": "2.0",\n' +
        '            "method": "jt_issueToken",\n' +
        '            "params": [\n' +
        '                {\n' +
        '                    "from": "' + userJID + '",\n' +   //用户JID
        '                    "to": "' + operatorJID + '",\n' +     //运营商JID
        '                    "token_info": {\n' +       //token的定义信息
        '                        "name": "' + type + '",\n' +        //类erc721的token的名称
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
        '                }\n' +
        '            ],\n' +
        '            "id": 1\n' +
        '        }';
    let jt_issueToken;
    //发行类似erc721的token,时间过长有问题
    $.ajax({
        type: "post",
        url: url,
        async: false,  //使用同步的方式,true为异步方式
        data: issueToken,
        dataType: "json",
        success: function (data) {
            jt_issueToken = data;
        },
        error: function (data) {
            jt_issueToken = data;
        }
    });
    return jt_issueToken;
}

function jt_createTokens(issueTokenHash, type, data) {
    let createToken = '{\n' +
        '    "jsonrpc": "2.0",\n' +
        '    "method": "jt_createToken",\n' +
        '    "params": [\n' +
        '        {\n' +
        '            "from": "' + operatorJID + '",\n' +
        '            "to": "' + userJID + '",\n' +
        '            "secret": "' + operatorSecret + '",\n' +
        '            "token": {\n' +
        '                "info": "' + issueTokenHash + '",\n' + //类erc721的定义token的hash, 见jt_issueToken返回值
        '                "uri": "http://www.jingtum.com",\n' +  //类erc721的token的uri, erc721标准属性
        '                "items": [\n' +    //该token的属性
        '                    {\n' +
        '                        "name": "' + type + '",\n' +   //该属性的名称
        '                        "value": {\n' +    //该属性的值，要符合jt_issueToken中的定义
        '                            "' + type + '": [\n' +
        data + '\n' +
        '                            ]\n' +
        '                        }\n' +
        '                    }\n' +
        '                ]\n' +
        '            }\n' +
        '        }\n' +
        '    ]\n' +
        '}';
    //创建类似erc721的token
    console.log(createToken);
    let jt_createToken;
    $.ajax({
        type: "post",
        url: url,
        async: false,  //使用同步的方式,true为异步方式
        data: createToken,
        dataType: "json",
        success: function (data) {
            jt_createToken = data;
        },
        error: function (data) {
            jt_createToken = data;
        }
    });
}

function jt_getTokenByHashs(token) {
    var getTokenByHash = '{\n' +
        '            "jsonrpc": "2.0",\n' +
        '            "method": "jt_getTokenByHash",\n' +
        '            "params": [\n' +
        '				"' + token + '"\n ' +
        '            ],\n' +
        '            "id": 1\n' +
        '        }';
    let jt_getTokenByHash;
    $.ajax({
        type: "post",
        url: url,
        async: false,  //使用同步的方式,true为异步方式
        data: getTokenByHash,
        dataType: "json",
        success: function (data) {
            jt_getTokenByHash = data;
        },
        error: function (data) {
            jt_getTokenByHash = data;
        }
    });
    return jt_getTokenByHash;
}

function jt_removeTokens(token) {
    let removeToken = '{\n' +
        '    "jsonrpc":"2.0",\n' +
        '    "method":"jt_removeToken",\n' +
        '    "params":[\n' +
        '        {\n' +
        '            "from":"' +
        userJID + '", \n' +
        '            "to":"' +
        operatorJID + '",\n' +
        '            "secret":"' +
        userSecret + '",\n' +
        '            "token":"' + token + '"\n' +
        '        }\n' +
        '    ],\n' +
        '    "id":1\n' +
        '}';
    console.log(removeToken);
    let jt_removeToken;
    $.ajax({
        type: "post",
        url: url,
        async: false,  //使用同步的方式,true为异步方式
        data: removeToken,
        dataType: "json",
        success: function (data) {
            jt_removeToken = data;
        },
        error: function (data) {
            jt_removeToken = data;
        }

    });
    console.log(jt_removeToken);
}

module.exports = IpfsUtil;