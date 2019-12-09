const _ = require('lodash')
const request = require('request')
const Promise = require('promise')
const iconv = require('iconv-lite')

module.exports = async (opt) => {
    return await new Promise((reslove,reject) => {
            request(opt, function (err, response, body) {
                if (err){
                    reject(err);
                }else{
                    //对charset判断并进行转码(主要针对gbk)
                    if (_.isEmpty(opt.encoding)){//需要将encoding参数设置为null
                        //body为buffer
                        body = iconv.decode(body, opt._encoding).toString();
                    }
                    reslove({response: response, body: body});
                }
            })
        });
}