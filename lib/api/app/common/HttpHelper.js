const S = require('string')
const _ = require('lodash')

const request = require('superagent')
const SuperAgent = require('superagent-charset')(request)

const myLog4js = require('koa2-strong-api').Logger;

class HttpHelper {

    constructor() {
        this.logger = myLog4js

        this.request_timeout = 8 * 1000
        this.deadline_timeout = 1 * 60 * 1000
    }

    initGetHttpWithHeader (mode, host, referrer, origin, cookie) {
        let headers = {};

        if ('phone' == mode){//user-agent
            headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
        } else if ('android' == mode) {
            headers['User-Agent'] = 'jqm-and-app'
        } else{
            headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36';
        }

        if (S(host).isEmpty() == false){
            headers['Host'] = host;
        }

        if (S(origin).isEmpty() == false){
            headers['Origin'] = origin;
        }

        if (S(referrer).isEmpty() == false){
            headers['Referer'] = referrer;
        }

        if (S(cookie).isEmpty() == false){
            headers['Cookie'] = cookie;
        }

        // headers['Accept-Language'] = 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4';
        headers['Accept'] = '*/*';
        headers['Connection'] = 'keep-alive';
        // headers['Accept-Encoding'] = 'gzip, deflate, br';
        headers['Cache-Control'] = 'no-cache';

        return headers;
    }

    initPostHttpWithHeader (mode, host, referrer, origin, cookie) {
        let headers = this.initGetHttpWithHeader(mode, host, referrer, origin, cookie);

        headers['X-Requested-With'] = 'XMLHttpRequest';

        return headers;
    }

    getUrlHost (url) {
        let reg = /^http(s)?:\/\/(.*?)\//
        return reg.exec(url)[2]
    }

    async getParseHttpResult (requestUrl, referrer, mode, cookie, encoding) {
        let host = this.getUrlHost(requestUrl);
        let headers = this.initGetHttpWithHeader(mode, host, referrer, '', cookie);

        let charset = encoding || 'UTF-8'

        myLog4js.info('HttpHelper getParseHttpResult' + '<|>requestUrl:' + requestUrl)

        try{
            let result = await SuperAgent.get(requestUrl).charset(charset).set(headers).timeout({
                response: this.request_timeout,  // Wait request_timeout for the server to start sending,
                deadline: this.deadline_timeout, // but allow deadline_timeout for the file to finish loading.
            }).buffer(true)

            return result;

        }catch (err){
            this.logger.error(err);
        }

        return null;

    }

    async postFormDataParseHttpResult (requestUrl, formData, mode, referrer, ttpUrl, cookie, encoding) {

        let ttpHost = this.getUrlHost(ttpUrl);

        let protocol = "http";
        if (S(ttpUrl).startsWith('https')){
            protocol = 'https';
        }
        let origin = protocol + "://" + ttpHost;
        let host = this.getUrlHost(requestUrl);

        if (S(referrer).isEmpty()){
            referrer = ttpUrl;
        }

        let headers = this.initPostHttpWithHeader(mode, host, referrer, origin, cookie);

        let charset = encoding || 'UTF-8'

        formData = formData || {}

        myLog4js.info('HttpHelper postFormDataParseHttpResult' + '<|>requestUrl:' + requestUrl + '<|>formData:' + JSON.stringify(formData))

        try{
            let requestPromise = SuperAgent.post(requestUrl)
            for (let name in formData) {
                requestPromise.field(name, formData[name])
            }
            let result = await requestPromise.charset(charset).set(headers).timeout({
                response: this.request_timeout,  // Wait request_timeout for the server to start sending,
                deadline: this.deadline_timeout, // but allow deadline_timeout for the file to finish loading.
            }).buffer(true)

            return result;
        }catch (err){
            this.logger.error(err);
        }

        return null;
    }

    async postFormUrlencodedParseHttpResult (requestUrl, formData, mode, referrer, ttpUrl, cookie, encoding) {

        let headers = this.initPostHttpWithHeader(requestUrl, mode, referrer, ttpUrl, cookie);

        let charset = encoding || 'UTF-8'

        formData = formData || {}

        myLog4js.info('HttpHelper postFormUrlencodedParseHttpResult' + '<|>requestUrl:' + requestUrl + '<|>formData:' + JSON.stringify(formData))

        try{
            let result = await SuperAgent.post(requestUrl).send(formData).charset(charset).set(headers).timeout({
                response: this.request_timeout,
                deadline: this.deadline_timeout,
            }).buffer(true)

            return result;
        }catch (err){
            this.logger.error(err);
        }

        return null;
    }

    getUrlParam (url) {
        let param = {}
        if (url.indexOf('?') >= 0) {
            let paramText = url.split('?')[1]
            paramText = S(paramText).trim().s
            let params = paramText.split('&')
            for(let i = 0; i < params.length; i ++) {
                let paramItem = params[i]
                if (S(paramItem).isEmpty() == false) {
                    param[paramItem.split("=")[0]] = decodeURIComponent(paramItem.split("=")[1])
                }

            }
        }
        return param
    }

}

let helper = new HttpHelper();

module.exports = helper