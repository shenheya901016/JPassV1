import {IpfsRemote} from "ipfslib";
import myIpfs from '../src/myIpfs';

const fs = require("fs")
let remote = new IpfsRemote({urls: ["http://139.198.191.254:8545/v1/jsonrpc"]});
//用户钱包地址
let userJID = "j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
//用户钱包私钥
let userSecret = "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h";
//运营商钱包地址
let operatorJID = "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS";
//运营商钱包私钥
let operatorSecret = "ssxWidEVcs6bCtsVbfd7gMXUoRfMW";
//数据类型（data、file）
let type = "data";

describe("test Ipfs", async function () {
    describe("所有接口测试", async function () {
        /*it("myIpfs: test", async function () {
            //console.log(await myIpfs.getWalletBalance('j4M4AoSi522XxNpywfyBahmjzQihc4EegL'));   //查询该钱包地址是否被激活
            //console.log(await myIpfs.init("file",userJID,userSecret,operatorJID,operatorSecret));    //初始化IPFS type：1.file类型 2.data类型
            //console.log(await myIpfs.read(userJID));    //读取该钱包地址在ipfs中存储的所有data数据
            //console.log(await myIpfs.write('file','{"base64":"asdsar123dsfsd23453fsdf234"}',userJID, userSecret, operatorJID, operatorSecret)); //向IPFS中保存数据
            //console.log(await myIpfs.getTransactionStat("819FBB17F14757D71C1091ABF562C4E2D200CE3976283DFD3896D3E087BEDDC5"));    //判断向ipfs写入数据是否完成（同步是否完成）
            //console.log(await myIpfs.readByHash('776CAA6B90F6C08023EF64F6177F8D10080C0F69766DD635EA45E94CAB1D76E2', userSecret));   //直接根据hash值，查找单个file数据
        });*/
        it("判断账号是否激活", async function () {
            let result = await myIpfs.getWalletBalance(userJID);
            if (result === "success") {
                console.log("该账号已被激活！");
            } else {
                console.log("该账号未被激活！");
            }
        });
        it("初始化数据（初始化后才能向IPFS中存数据）", async function () {
            let result = await myIpfs.init(type, userJID, userSecret, operatorJID, operatorSecret);
            if (result.status === "success") {
                console.log("该账号初始化已成功，但未知同步是否完成！");
            } else {
                console.log("该账号初始化失败！");
            }
        });
        it('判断同步是否完成', async function () {
            let initResult = await myIpfs.init(type, userJID, userSecret, operatorJID, operatorSecret);
            let result = await myIpfs.getTransactionStat(initResult.result[0].transaction);
            if (result.status === "success") {
                console.log("该账号同步完成！");
            } else {
                console.log("该账号同步失败！");
            }
        });
        it('向IPFS中写入数据', async function () {
            let result = await myIpfs.write(type, "自己填写", userJID, userSecret, operatorJID, operatorSecret);
            if (result.status === "success") {
                console.log("该账号向IPFS中写入数据成功！");
            } else {
                console.log("该账号向IPFS中写入数据失败！");
            }
        });
        it('从IPFS中读取所有data类型数据', async function () {
            let result = await myIpfs.read(userJID, userSecret);
            if (result.status === "success") {
                console.log("该账号保存在IPFS中的数据为：" + result.result.Items[0].Value);
            } else {
                console.log("获取该账号保存在IPFS中的数据失败！");
            }
        });
        it('根据Hash从IPFS中读取数据，一般用于读取file数据',async function () {
            let writeResult = await myIpfs.write("file", "自己填写", userJID, userSecret, operatorJID, operatorSecret);
            let result=await myIpfs.readByHash(result.result.hash,userSecret);
            if (result.status === "success") {
                console.log("该账号保存在IPFS中的数据为：" + result.result.Items[0].Value);
            } else {
                console.log("获取该账号保存在IPFS中的数据失败！");
            }
        });
    });
    /*describe("test get tokens", function () {
        it("jt_tokensOf: jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh", function () {
            remote.TokensOf(['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
        it("jt_tokensOf: jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF", function () {
            remote.TokensOf(['jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF'], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test upload file", function () {
        it("jt_uploadFile: test", function () {
            const filePath = "~/Downloads/x963-7-5-98.pdf"

            // const fileData = fs.readFileSync(filePath)
            const fileReader = fs.createReadStream(filePath)
            remote.UploadFile(fileReader, function (list) {
                console.log('[success]', list);
            }, function (error) {
                console.log('[error]', error);
            })
        })
    })
    describe("test download file", function () {
        it("jt_downloadFile: test", function () {
            const filePath = "/JPassV1/test/1.jpg"
            const fileWriter = fs.createWriteStream(filePath)
            remote.DownloadFile("BD1A3B547B20F91635F6F4B625A7BF736916D8E32C60F4F7572349CB3756DDD5", fileWriter, function () {
                console.log('[success]', filePath);
            }, function (error) {
                fs.unlinkSync(filePath);
                console.log('[error]', error);
            })
        })
    })
    describe("test create data", function () {
        it("jt_createData: test", function () {
            remote.CreateData([{
                from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                to: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                secret: "snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
                data: ["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test remove data", function () {
        it("jt_removeData: test", function () {
            remote.RemoveData([{
                from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                to: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                secret: "sha4eGoQujTi9SsRSxGN5PamV3YQ4",
                data: ["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test issue token", function () {
        it("jt_issueToken: test", function () {
            remote.IssueToken([{
                from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                to: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                secret: "snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
                token_info: {
                    name: "test token",
                    symbol: "TEST",
                    total_supply: 10,
                    items: [
                        {
                            name: "name",
                            type: "string",
                            desc: "the name of the file"
                        },
                        {
                            name: "file",
                            type: "file",
                            desc: "the content of the file"
                        }
                    ]
                }
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test create token", function () {
        it("jt_createToken: test", function () {
            remote.CreateToken([{
                from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                to: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                secret: "sha4eGoQujTi9SsRSxGN5PamV3YQ4",
                token: {
                    info: "D1F9F109FF49738C95988E06710B14647EE3254587ADE8BE0FD14387911CBCC8",
                    uri: "www.test.com",
                    items: [
                        {
                            name: "name",
                            value: "test.pdf",
                        },
                        {
                            name: "file",
                            value: "AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678",
                        }
                    ]
                }
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test transfer token", function () {
        it("jt_createToken: test", function () {
            remote.TransferToken([{
                from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                to: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                secret: "sha4eGoQujTi9SsRSxGN5PamV3YQ4",
                token: "FD8A2539D3AACBF9924A80B167C4DD3FC90BD6244D76AC0F77A90AABEEA361E2",
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })
    describe("test remove token", function () {
        it("jt_removeToken: test", function () {
            remote.RemoveToken([{
                from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
                to: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
                secret: "snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
                token: "FD8A2539D3AACBF9924A80B167C4DD3FC90BD6244D76AC0F77A90AABEEA361E2",
            }], function (data) {
                console.log('[success]', JSON.stringify(data))
            }, function (error) {
                console.log('[error]', error)
            })
        })
    })*/
});
