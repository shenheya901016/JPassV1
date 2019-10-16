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
            //console.log(await MyIpfs.bal(userJID));//查询该钱包地址是否被激活
            console.log(await MyIpfs.read(userJID));//读取该钱包地址在ipfs中存储的数据
            //console.log(await MyIpfs.write(
                //'{"models":[{"id":"1","name":"模板1"}],"profile":[{"id":"1","name":"个人信息1"}],"project":[{"id":"1","name":"项目1"}]}',
                //userJID,userSecret,operatorJID,operatorSecret));//data是决定传字符串还是object未决定 暂时传字符串  向ipfs中写入数据  会返回一个transaction参数提供给tra()
            //console.log(await MyIpfs.init(userJID,userSecret,operatorJID,operatorSecret));//当判断用户钱包地址已被激活时执行 每个用户只会执行一次该方法
            //console.log(await MyIpfs.tra("699710DA3B50D7F13FD8981A098A6427564911E8C3A6B0F60DEB1DD3FC2E748C"));//判断向ipfs写入数据是否完成（同步是否完成）
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
