const CryptoJS = require("crypto-js");
const S = require('string');

class CryptoHelper {

    constructor(key) {
        if (S(key).isEmpty() == false) {
            this.key = key
        }
    }

    sha1Encrypt(message) {//sha1加密
        let cipher = CryptoJS.SHA1(message);

        return cipher.toString();
    }
}
let helper = new CryptoHelper();

module.exports = helper