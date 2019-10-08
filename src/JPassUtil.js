'use strict';
const eccrypto = require("./eccrypto");
const bip39 = require('bip39');
const swtcFactory = require("swtc-factory");

let JPassUtil = {
    ECCCrypto: {
        /**
         * 使用公钥加密数据
         * @param {string} publicKey 公钥
         * @param {string} message 待价密的数据
         * @returns {{iv: string, ephemPublicKey: string,ciphertext: string,mac: string}}
         */
        encryptWithPublicKey(publicKey, message) {
            let encryptedBuffers = eccrypto.encrypt(Buffer.from(publicKey, 'hex'), Buffer.from(message));
            return {
                iv: encryptedBuffers.iv.toString('hex').toUpperCase(),
                ephemPublicKey: encryptedBuffers.ephemPublicKey.toString('hex').toUpperCase(),
                ciphertext: encryptedBuffers.ciphertext.toString('hex').toUpperCase(),
                mac: encryptedBuffers.mac.toString('hex').toUpperCase()
            };
        },
        /**
         * 使用私钥解密数据
         * @param {string} privateKey 私钥
         * @param {{iv: string, ephemPublicKey: string,ciphertext: string,mac: string}} encrypted 待解密的数据
         * @returns {string}
         */
        decryptWithPrivateKey(privateKey, encrypted) {
            const encryptedBuffer = {
                iv: Buffer.from(encrypted.iv, 'hex'),
                ephemPublicKey: Buffer.from(encrypted.ephemPublicKey, 'hex'),
                ciphertext: Buffer.from(encrypted.ciphertext, 'hex'),
                mac: Buffer.from(encrypted.mac, 'hex')
            };
            return eccrypto.decrypt(Buffer.from(privateKey, 'hex'), encryptedBuffer).toString();
        }
    },
    Wallet: {
        /**
         * 从密钥中获取密钥对
         * @param {string} secret 私钥
         * @returns {{privateKey: string, publicKey: string}}
         */
        deriveKeyPair(secret) {
            let key = new swtcFactory.KeyPair("swt").deriveKeyPair(secret);
            return {
                privateKey: key.privateKey.substring(2),
                publicKey: key.publicKey
            };
        },
        /**
         * 创建钱包
         * @param {string} seed 编码后的助记词,可选参数
         * @returns {{secret: string, address: string}}
         */
        generateWallet(seed = "") {
            let options = {};
            if (seed && seed.length > 0) {
                options.entropy = Buffer.from(seed, "hex");
            }
            return swtcFactory.Wallet.generate("swt", options);
        }
    },
    Mnemonic: {
        /**
         * 生成助记词
         * @param {int} number 助记符的数量,目前仅支持12,15,18,21,24数量
         * @param {string} language 生成的助记符语言,简体中文(zh-CN),繁体中文(zh-TW),英语(en-US)
         * @returns {string} words
         */
        createMnemonic(number = 12, language = "zh-CN") {
            let strength = 0;
            if (number === 12) {
                strength = 128;
            } else if (number === 15) {
                strength = 160;
            } else if (number === 18) {
                strength = 192;
            } else if (number === 21) {
                strength = 224;
            } else if (number === 25) {
                strength = 256;
            }
            let word = undefined;
            if (language === "zh-CN") {
                word = bip39.wordlists.chinese_simplified;
            } else if (language === "zh-TW") {
                word = bip39.wordlists.chinese_traditional;
            } else if (language === "en-US") {
                word = bip39.wordlists.english;
            }
            return bip39.generateMnemonic(strength, null, word);
        },
        /**
         * 助记词编码,生成随机种子
         * @param {string} mnemonic 助记符
         * @param {string} language 生成的助记符语言,简体中文(zh-CN),繁体中文(zh-TW),英语(en-US)
         * @returns {string}
         */
        wordsToEntropy(mnemonic, language = "zh-CN") {
            let word = undefined;
            if (language === "zh-CN") {
                word = bip39.wordlists.chinese_simplified;
            } else if (language === "zh-TW") {
                word = bip39.wordlists.chinese_traditional;
            } else if (language === "en-US") {
                word = bip39.wordlists.english;
            }
            return bip39.mnemonicToEntropy(mnemonic, word).toUpperCase();
        },
        /**
         * 助记词解码,还原助记词
         * @param {string} encrytMnemonic 编码后的助记词
         * @param {string} language 生成的助记符语言,简体中文(zh-CN),繁体中文(zh-TW),英语(en-US)
         * @returns {string}
         */
        entropyToWords(encrytMnemonic, language = "zh-CN") {
            let word = undefined;
            if (language === "zh-CN") {
                word = bip39.wordlists.chinese_simplified;
            } else if (language === "zh-TW") {
                word = bip39.wordlists.chinese_traditional;
            } else if (language === "en-US") {
                word = bip39.wordlists.english;
            }
            return bip39.entropyToMnemonic(encrytMnemonic, word);
        },
        /**
         * 验证助记词
         * @param {string} mnemonic 助记符
         * @param {string} language 生成的助记符语言,简体中文(zh-CN),繁体中文(zh-TW),英语(en-US)
         * @returns {boolean}
         */
        validateMnemonic(mnemonic, language = "zh-CN") {
            let word = undefined;
            if (language === "zh-CN") {
                word = bip39.wordlists.chinese_simplified;
            } else if (language === "zh-TW") {
                word = bip39.wordlists.chinese_traditional;
            } else if (language === "en-US") {
                word = bip39.wordlists.english;
            }
            return bip39.validateMnemonic(mnemonic, word);
        }
    }
};

module.exports = JPassUtil;
