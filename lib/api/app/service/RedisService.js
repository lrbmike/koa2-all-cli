'use strict';

const myLog4js = require('koa2-strong-api').Logger;
const Redis = require('ioredis');

const redisConfig = require('../../config/redis.json');

let client = new Redis(redisConfig.redis);

class RedisService {

    constructor(client) {
        this.redis = client;
        this.logger = myLog4js;
    }

    async set(key, value) {
        try {
            if (this.redis) {
                return await this.redis.set(key, value)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async get(key) {
        try {
            if (this.redis) {
                return await this.redis.get(key)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async zadd(key, score, value) {
        try {
            if (this.redis) {
                return await this.redis.zadd(key, score, value)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async zrevrange(key, beginIndex, endIndex, isWithscores) {
        try {
            if (this.redis) {
                if (isWithscores){
                    let data = new Array();
                    let dataWithscores = await this.redis.zrevrange(key, beginIndex, endIndex, 'withscores');
                    for (let i=0; i<dataWithscores.length; i++){
                        let val = dataWithscores[i];
                        let scores = dataWithscores[i + 1];
                        let item = {'val': val, 'scores': scores};
                        data.push(item);
                        i ++;
                    }
                    return data
                }else{
                    return await this.redis.zrevrange(key, beginIndex, endIndex)
                }
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async setExpire(key, seconds) {
        try {
            if (this.redis) {
                return await this.redis.expire(key, seconds)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async setWithExpire(key, value, seconds) {
        if (this.redis) {
            this.set(key, value)
            this.setExpire(key, seconds)
        }
        return null
    }

    async zincrby(key, increment, member) {
        try {
            if (this.redis) {
                return await this.redis.zincrby(key, increment, member)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async del(key) {
        try {
            if (this.redis) {
                return await this.redis.del(key)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async keys(keywords) {
        try {
            if (this.redis){
                return await this.redis.keys(keywords)
            }
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async close() {
        if (this.redis) {
            return await this.redis.disconnect()
        }
    }

}

let redisService = new RedisService(client);

module.exports = redisService