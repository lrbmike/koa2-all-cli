const ORM = require('../middleware/orm').connect;

class DataBaseModel {

    constructor(opts) {
        this.opts = opts || {};
        this.orm = ORM
    }

    async getAllTables() {
         let tables = await this.orm.sequelize.query('show tables', { type: this.orm.sequelize.QueryTypes.SELECT});
         return tables
    }

    async getTableColumns(tableName) {
        let sql = 'select * from information_schema.COLUMNS where table_name = "' + tableName + '"';
        let columns = await this.orm.sequelize.query(sql, { type: this.orm.sequelize.QueryTypes.SELECT});
        return columns
    }

}

let dataBaseModel = new DataBaseModel();

module.exports = dataBaseModel