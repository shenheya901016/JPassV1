const chai = require("chai")
const fs = require("fs")
const expect = chai.expect
import {IpfsRemote} from "ipfslib";

let remote = new IpfsRemote({urls: ["http://139.198.191.254:8545/v1/jsonrpc"]})
let userJID="j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
let userSecret="sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h";
let operatorJID="jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS";
let operatorSecret="ssxWidEVcs6bCtsVbfd7gMXUoRfMW";
import MyIpfs from './MyIpfs';

describe("test Ipfs", async function () {
    describe("myIpfs", async function () {
        it("myIpfs: test", async function () {
            //await MyIpfs.sel(['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'])//查询所有
            //await MyIpfs.add('{"id":"id1","name":"name1"}',"models",['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'])//增加
            //await MyIpfs.del('{"id":"id1","name":"name1"}',"models",['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'])//删除
            //await MyIpfs.upd('{"id":"1","name":"name33333"}',"models",['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'])//修改
            //await MyIpfs.cre(['j4M4AoSi522XxNpywfyBahmjzQihc4EegL'])//用户初始化
            //console.log(await MyIpfs.bal(['jd4RCFsNPwguVpE5C9zrUEqod9HPWsQ2B']))//查询钱包余额 判断是否激活
            //console.log(await MyIpfs.tra(['2BB9DBE78C1196CC15FED1626C1A9CFD1232991D7F2E26409D5A70400A771829']))//查询某个交易详情信息 判断是否完成上次同步
        })
    })
    describe("test get tokens", function () {
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
    // describe("test upload file", function() {
    //     it("jt_uploadFile: test", function() {
    //         const filePath = "~/Downloads/x963-7-5-98.pdf"

    //         // const fileData = fs.readFileSync(filePath)
    //         const fileReader = fs.createReadStream(filePath)
    //         remote.UploadFile(fileReader, function (list) {
    //             console.log('[success]', list);
    //         }, function (error) {
    //             console.log('[error]', error);
    //         })
    //     })
    // })
    // describe("test download file", function() {
    //     it("jt_downloadFile: test", function() {
    //         const filePath = "~/Downloads/test.pdf"
    //         const fileWriter = fs.createWriteStream(filePath)
    //         remote.DownloadFile("AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678", fileWriter, function () {
    //             console.log('[success]', filePath);
    //         }, function (error) {
    //             fs.unlinkSync(filePath);
    //             console.log('[error]', error);
    //         })
    //     })
    // })
    // describe("test create data", function() {
    //     it("jt_createData: test", function() {
    //         remote.CreateData([{
    //             from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             to:"jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             secret:"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
    //             data:["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test remove data", function() {
    //     it("jt_removeData: test", function() {
    //         remote.RemoveData([{
    //             from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             to:"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             secret:"sha4eGoQujTi9SsRSxGN5PamV3YQ4",
    //             data:["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test issue token", function() {
    //     it("jt_issueToken: test", function() {
    //         remote.IssueToken([{
    //             from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             to:"jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             secret:"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
    //             token_info: {
    //                 name:"test token",
    //                 symbol:"TEST",
    //                 total_supply:10,
    //                 items:[
    //                     {
    //                         name:"name",
    //                         type:"string",
    //                         desc:"the name of the file"
    //                     },
    //                     {
    //                         name:"file",
    //                         type:"file",
    //                         desc:"the content of the file"
    //                     }
    //                 ]
    //             }
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test create token", function() {
    //     it("jt_createToken: test", function() {
    //         remote.CreateToken([{
    //             from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             to:"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             secret:"sha4eGoQujTi9SsRSxGN5PamV3YQ4",
    //             token: {
    //                 info:"D1F9F109FF49738C95988E06710B14647EE3254587ADE8BE0FD14387911CBCC8",
    //                 uri:"www.test.com",
    //                 items:[
    //                     {
    //                         name:"name",
    //                         value:"test.pdf",
    //                     },
    //                     {
    //                         name:"file",
    //                         value:"AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678",
    //                     }
    //                 ]
    //             }
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test transfer token", function() {
    //     it("jt_createToken: test", function() {
    //         remote.TransferToken([{
    //             from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             to:"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             secret:"sha4eGoQujTi9SsRSxGN5PamV3YQ4",
    //             token: "FD8A2539D3AACBF9924A80B167C4DD3FC90BD6244D76AC0F77A90AABEEA361E2",
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test remove token", function() {
    //     it("jt_removeToken: test", function() {
    //         remote.RemoveToken([{
    //             from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             to:"jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             secret:"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
    //             token: "FD8A2539D3AACBF9924A80B167C4DD3FC90BD6244D76AC0F77A90AABEEA361E2",
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
})
