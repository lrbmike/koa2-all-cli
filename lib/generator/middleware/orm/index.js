'use strict';

const path = require('path')

let dbConfig = require('../../config/db.json')
let _path = path.resolve('./')
dbConfig.modelPath = path.join(_path, '/lib/generator/schema')

const orm = require('koa-orm')(dbConfig);

const database = orm.database();

class DbConnect {

    constructor(database){
        this.db = database
    }

    getDatabase() {
        return this.db
    }
}

let connect = new DbConnect(database);

module.exports = {
    connect: connect.getDatabase()
}

// if (!(dbConfig instanceof Array)) {
//     dbConfig.modelPath = path.join(process.cwd(), dbConfig.modelPath);
//     dbConfig = [dbConfig];
// }
//
// let dbs = orm(dbConfig);
//
// class DbConnect {
//
//     constructor(dbs) {
//         this.databases = dbs
//     }
//
//
//     getConnect(name) {
//         const first = dbConfig[0];
//         name = name || first.name || first.db || first.database;
//         return this.databases[name];
//     }
// }

// let connect = new DbConnect(dbs);
//
// module.exports = {
//     connect: connect
// }

// module.exports = (opts) => {
//
//     if (!(dbConfig instanceof Array)) {
//         dbConfig.modelPath = path.join(process.cwd(), dbConfig.modelPath);
//         dbConfig = [dbConfig];
//     }
//     let name = opts.name;
//     const databases = orm(dbConfig);
//     const first = dbConfig[0];
//     name = name || first.name || first.db || first.database;
//     return databases[name];
// }

// const Injection = require('../injection')

// module.exports = (configs) => async (ctx, next) => {
//     // Object to Array
//     if (!(configs instanceof Array)) {
//         configs = [configs];
//     }
//     var name = configs.name;
//     const databases = orm(configs);
//     const first = configs[0];
//     name = name || first.name || first.db || first.database;
//     var database = databases[name]
//
//     var injection = new Injection({'database': database});
//     console.log(injection)
//
//
//     // function db(name) {
//     //     const first = configs[0];
//     //     // Default is first database
//     //     name = name || first.name || first.db || first.database;
//     //     return databases[name];
//     // }
//     //
//     // function mw(ctx, next) {
//     //     if (ctx.orm) return next();
//     //     var _db = db;
//     //     return next();
//     // }
//     //
//     // return {
//     //     database: db,
//     //     middleware: mw
//     // };
//     await next();
// };
