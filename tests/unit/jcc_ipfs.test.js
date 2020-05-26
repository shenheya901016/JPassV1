// add.test.js
let Jcc_ipfs = require('./jcc_ipfs.js');
let expect = require('chai').expect;
let http = require('http');
let JPassUtil = require("jpass-util");
let request = require("request");

describe('jcc_ipfs测试', async function () {
    it('写文件', async function () {
        await Jcc_ipfs.Ipfs.write("sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h", "测试数据", "/mian.txt");
    });
    it('读文件内容', function () {
        Jcc_ipfs.Ipfs.read("/test.txt", "j4M4AoSi522XxNpywfyBahmjzQihc4EegL");
    });
    /* it('列出目录文件', function () {
        Jcc_ipfs.Ipfs.list("/test.txt","j4M4AoSi522XxNpywfyBahmjzQihc4EegL");
    });
    it('删除文件', function () {
        Jcc_ipfs.Ipfs.remove("sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h","/test.txt");

    });*/
});
