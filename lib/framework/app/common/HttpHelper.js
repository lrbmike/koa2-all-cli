const S = require('string')
const _ = require('lodash')
const XRegExp = require('xregexp')

const CryptoHelper = require('./CryptoHelper')
const StringHelper = require('./StringHelper')
const HashMap = require('./HashMap')

const myLog4js = require('../middleware/log4js')
const myrq = require('../middleware/request')

const RedisService = require('../service/RedisService').redis

class HttpHelper {

    constructor() {
        this.logger = myLog4js

        this.request_timeout = 30000
        this.redis_timeout = 2 * 60;
    }

    mode(ctx) {
        let headers = ctx.headers
        let userAgent = headers['user-agent'];
        let isIPad = userAgent.match(/iPad|Version(.*)Safari/i) != null;
        if (isIPad){
            return "iPad";
        }
        let isPhone = userAgent.match(/iPhone|Android|Linux|iPod/i) != null;
        if (isPhone){
            return "phone";
        }
        return "pc";
    }

    requestIp(ctx) {
        let ipAddress;
        let forwardedIpsArr = ctx.ips;
        if (forwardedIpsArr && forwardedIpsArr.length > 0) {
            ipAddress = forwardedIpsArr[0];
        }
        if (!ipAddress) {
            ipAddress = ctx.ip;
        }
        return ipAddress;
    }

    userToken(ctx) {
        let name = 'jqm_ut';
        let ut = this.getCookie(name, ctx);
        if (S(ut).isEmpty()) {
            //用户标识由IP和时间戳组成
            let ip = this.requestIp(ctx);
            let token = ip + '#' + new Date().getTime();
            //进行sha1加密
            ut = CryptoHelper.sha1Encrypt(token);
            //保存cookie(一周)
            this.setCookie(name, ut, 7*24*60*60*1000, ctx);
        }

        this.logger.info('HttpHelper userToken' + '<|>ut:' + ut)

        return ut;
    }

    setCookie(name, value, maxAge, ctx) {
        ctx.cookies.set(name, encodeURIComponent(value), {domain: 'jiqimao.tv', maxAge: maxAge, httpOnly: false, overwrite: true})
    }

    getCookie(name, ctx) {
        let value = ctx.cookies.get(name)
        if (S(value).isEmpty() == false){
            return decodeURIComponent(value)
        }
        return null;
    }

    deleteCookie(name, ctx) {
        ctx.cookies.set(name, '', {domain: 'jiqimao.tv', maxAge:0, httpOnly: false, overwrite: true})
    }

    responseJsonp(resDataObj, jsonpcallback) {
        let resDataStr = '';

        if (typeof(resDataObj) == 'string'){
            resDataStr = resDataObj;
        }else {
            resDataStr = JSON.stringify(resDataObj);
        }

        if (S(jsonpcallback).isEmpty() == false){
            resDataStr = jsonpcallback + '(' + resDataStr + ')';
        }

        return resDataStr;
    }

    checkUserCookies (ctx) {
        let result = {success: false}

        let cookie = this.getCookie('userInfo', ctx);
        if (S(cookie).isEmpty() == false){

            let obj = JSON.parse(cookie)
            if (S(obj.id).isEmpty() == false && S(obj.sid).isEmpty() == false && S(obj.secret).isEmpty() == false){
                let key = 'org.liurb#' + obj.id + '#' + obj.sid;
                let secret = CryptoHelper.sha1Encrypt(key);
                if (secret == obj.secret) {
                    result.success = true
                    result.data = obj
                }
            }
        }

        return result
    }

    objToQuery (paramObj) {
        let query = ''
        for (let p in paramObj){//遍历对象赋值
            if (typeof ( paramObj[p]) != " function "){
                query += p + '=' + paramObj[p] + '&'
            }
        }
        if (S(query).isEmpty() == false) {
            query = StringHelper.replaceEndString(query, '&')
        }
        return query
    }

    getUrlHost (url) {
        let hostReg = XRegExp('\\w+://(.*?)/');
        let host = hostReg.exec(url);
        return host[1];
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
        headers['Accept-Encoding'] = 'gzip, deflate';
        headers['Cache-Control'] = 'no-cache';

        return headers;
    }

    initPostHttpWithHeader (mode, host, referrer, origin, cookie) {
        let headers = this.initGetHttpWithHeader(mode, host, referrer, origin, cookie);

        headers['X-Requested-With'] = 'XMLHttpRequest';

        return headers;
    }

    async getParseHttpResult (requestUrl, referrer, mode, cookie, redisParseKey, isGzip) {
        let host = this.getUrlHost(requestUrl);
        if (S(cookie).isEmpty()){
            //从缓存读取cookie
            cookie = await RedisService.get(redisParseKey);
        }
        let headers = this.initGetHttpWithHeader(mode, host, referrer, '', cookie);

        let options = {
            url: requestUrl,
            method: 'get',
            headers: headers,
            timeout: this.request_timeout,
            encoding: 'utf-8',
            gzip: isGzip
        };

        try{
            let result = await myrq(options);

            //处理返回的headers
            if (result && result.response){
                await this.handleResponseHeaders(result.response.headers, redisParseKey);
            }

            return result;

        }catch (err){
            this.logger.error(err);
        }

        return null;

    }

    async postParseHttpResult (requestUrl, formData, mode, referrer, ttpUrl, cookie, redisParseKey, isGzip) {

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

        if (S(cookie).isEmpty()){
            //从缓存读取cookie
            cookie = await RedisService.get(redisParseKey);
        }

        let headers = this.initPostHttpWithHeader(mode, host, referrer, origin, cookie);

        let options = {
            url: requestUrl,
            method: 'post',
            headers: headers,
            timeout: this.request_timeout,
            encoding: 'utf-8',
            gzip: isGzip,
            form: formData
        };

        try{
            let result = await myrq(options);

            //处理返回的headers
            if (result && result.response){
                await this.handleResponseHeaders(result.response.headers, redisParseKey);
            }

            return result;
        }catch (err){
            this.logger.error(err);
        }

        return null;
    }

    async handleResponseHeaders (responseHeaders, redisParseKey) {
        if (responseHeaders){
            let cookies = responseHeaders['set-cookie'];
            if (cookies && cookies.length > 0){
                let myMap = new HashMap();
                for (let i=0; i<cookies.length; i++){
                    let cookie = cookies[i];
                    let cookieMap = this.cookieStrToMap(cookie);
                    myMap.putAll(cookieMap);
                }

                //查看是否存在相应的缓存
                let redisCookie = await RedisService.get(redisParseKey);
                let redisMap = new HashMap();
                if (S(redisCookie).isEmpty() == false){//存在
                    redisMap = this.cookieStrToMap(redisCookie);
                }

                //如果存在，则将新的key覆盖旧的key
                if (redisMap.isEmpty() == false){
                    redisMap.putAll(myMap);
                }else{
                    redisMap = myMap;
                }

                let cookieStr = this.mapToCookieStr(redisMap);
                if (S(cookieStr).isEmpty() == false){
                    await RedisService.setWithExpire(redisParseKey, cookieStr, this.redis_timeout);
                }

            }
        }
    }

    cookieStrToMap (cookie) {
        let cookieMap = new HashMap();
        let cookieArr = cookie.split(';');
        for (let j=0; j<cookieArr.length; j++){
            let cookieStr = cookieArr[j];
            let cookieSplitArr = cookieStr.split('=');
            if (cookieSplitArr.length == 2){
                let cookieName = S(cookieSplitArr[0]).trim().s;
                if ('path' == cookieName || 'expires' == cookieName || 'domain' == cookieName){
                    continue;
                }
                let cookieValue = S(cookieSplitArr[1]).trim().s;
                if (cookieMap.containsKey(cookieName) == false){
                    cookieMap.put(cookieName, cookieValue);
                }
            }
        }

        return cookieMap;
    }

    mapToCookieStr (map) {
        let cookieStr = '';

        if (map && map.isEmpty() == false){
            let keys = map.keySet();
            for (let i=0; i<keys.length; i++){
                let key = keys[i];
                let value = map.get(key);
                cookieStr += key + '=' + value + ';';
            }
        }

        return cookieStr;
    }
}

let helper = new HttpHelper();

module.exports = helper