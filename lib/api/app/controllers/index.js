const JWT = require('koa2-strong-api').JWT

module.exports = {

    async index(ctx) {
        ctx.body = 'koa2-framework-api is ok'
    },

    async login(ctx) {

        let payload = {
            name: 'koa2-framework-api payload name'
        }
        let token = JWT.sign(payload)

        ctx.body = {
            user:'koa2-framework-api user',
            token
        }

        return false
    },

    async info(ctx) {
        let token = ctx.header.authorization
        let payload = JWT.verify(token);

        ctx.body = payload

        return false
    }

}