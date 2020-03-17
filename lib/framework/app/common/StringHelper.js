const S = require('string')
const _ = require('lodash')

class StringHelper {

    constructor(){
        this.PUNCTUATION_REG = /[\ |\~|\`|\!|\！|\·|\・|\～|\〜|\’|\◎|\@|\♡|\#|\$|\%|\^|\&|\*|\(|\)|\-|\（|\）|\_|\+|\=|\||\\|\[|\【|\]|\】|\{|\}|\;|\、|\:|\：|\"|\'|\,|\，|\<|\.|\。|\>|\/|\?|\？|\＊|\☆]/g;
    }

    getEnName(name){
        return this.replaceAllPunctuation(name).toLowerCase();
    }

    replaceAllPunctuation(str){
        return str.replace(this.PUNCTUATION_REG,'');
    }

    replaceEndString (content, str) {
        if (S(content).endsWith(str)){
            let len = str.length;
            content = content.substring(0,content.length-len);
        }

        return content;
    }

    getIds (data, key) {
        let ids = [];
        for (let i=0; i<data.length; i++){
            ids[i] = data[i][key];
        }
        return ids;
    }

}

let helper = new StringHelper();

module.exports = helper