'use strict';

const S = require('string')
const _ = require('lodash')

const ORM = require('../middleware/orm').connect;
const myLog4js = require('../middleware/log4js');

class BaseModel {

    constructor(opts){
        this.opts = opts || {};
        this.orm = ORM;
        this.model = this.opts.model;
        this.attrs = this.opts.attrs;
        this.list_attrs = this.opts.list_attrs;
        this.include_obj = this.opts.include_obj;
        this.logger = myLog4js;
    }

    async get(id) {
        return await this.orm[this.model].findByPk(id);
    }

    async getBySid(sid) {
        let clause = {'sid': sid};

        return await this.getOne(clause);
    }

    async getOne(clause) {
        return await this.orm[this.model].findOne({
            attributes: this.attrs,
            where: clause
        });
    }

    async getAll(clause, order) {
        if (S(order).isEmpty()) {
            order = [['id', 'asc']]
        }
        return await this.orm[this.model].findAll({
            attributes: this.attrs,
            where: clause,
            order: order
        })
    }

    async pageData(clause, offset, limit, order) {
        return await this.orm[this.model].findAll({
            attributes: this.list_attrs,
            where: clause,
            order: order,
            offset: offset,
            limit: limit
        })
    }

    async pageCount(clause, offset, limit, order) {
        return await this.orm[this.model].findAndCountAll({
            attributes: this.list_attrs,
            where: clause,
            order: order,
            offset: offset,
            limit: limit
        })
    }

    async pageCountJoin(clause, offset, limit, order, include_clause) {
        return await this.orm[this.model].findAndCountAll({
            include: {model: this.orm[this.include_obj.model], as: this.include_obj.as, where: include_clause},
            attributes: this.list_attrs,
            where: clause,
            order: order,
            offset: offset,
            limit: limit
        })
    }

    async create(obj) {
        try {
            let params = {}
            for (let p in obj){//遍历对象赋值
                if (typeof ( obj[p]) != " function "){
                    params[p] = obj[p]
                }
            }
            //自动添加并赋值(state=1、create_time、update_time)
            params.state = 1;
            params.create_time = new Date()
            params.update_time = new Date()

            let item = await this.orm[this.model].create(params);

            this.logger.info('BaseModel save' + '<|>table:' + this.model + '<|>params:' + JSON.stringify(params) + '<|>item:' + item.id)

            return this.get(item.id);

        }catch (err){
            this.logger.error(err)
        }

        return null
    }

    async update(values, clause) {
        values.update_time = new Date();
        try {
            let item = await this.orm[this.model].update(values, {where: clause});
            this.logger.info('BaseModel update' + '<|>table:' + this.model + '<|>values:' + JSON.stringify(values)
                + '<|>clause:' + JSON.stringify(clause) + '<|>item:' + item)
            return item
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }

    async delete(clause) {
        try {
            let item = await this.orm[this.model].destroy({where: clause})

            this.logger.info('BaseModel delete' + '<|>table:' + this.model + '<|>clause:' + JSON.stringify(clause)
                + '<|>item:' + item)
            return item
        }catch (err) {
            this.logger.error(err)
        }

        return null
    }
}

module.exports = BaseModel