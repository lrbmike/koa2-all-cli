const _ = require('lodash')

const dataBaseModel = require('../models/DataBaseModel')

class DataBaseService {

    constructor(opts) {
        this.opts = opts || {}
    }

    async showTables() {
        let tables = await dataBaseModel.getAllTables();

        let tableLength = tables.length;
        if (tableLength > 0) {
            let arr = new Array();
            for (let i=0; i<tableLength; i++) {
                let tableObj = tables[i];
                arr.push(getTableName(tableObj))
            }

            return arr
        }

        return []
    }

    async showTableColumns(tableName) {
        let tableColumns =  await dataBaseModel.getTableColumns(tableName);
        let arr = new Array();
        for (let i=0; i<tableColumns.length; i++) {
            let columnObj = tableColumns[i];
            let tableColumn = getTableColumn(columnObj)
            if (_.isEmpty(tableColumn) == false){
                arr.push(tableColumn)
            }
        }

        return arr
    }

}

function getTableName(tableObj) {
    for (let key in tableObj) {
        return tableObj[key]
    }
}

function getTableColumn(columnObj) {
    let colName = columnObj['COLUMN_NAME'];
    if ('id' == colName) {
        return null
    }

    let colType = columnObj['COLUMN_TYPE'];
    let dataType = columnObj['DATA_TYPE'];

    let columnType = getColumnType(dataType, colType)
    let item = {'columnName': colName, 'columnType': columnType}
    return item
}

function getColumnType(dataType, colType) {
    let str = 'Sequelize.';

    if ('varchar' == dataType) {
        str += 'STRING';
    } else if ('int' == dataType) {
        let num = colType.replace('int', '');
        str += 'INTEGER' + num;
    } else if ('datetime' == dataType) {
        str += 'DATE';
    } else if ('blob' == dataType) {
        str += 'BLOB'
    } else if ('float' == dataType) {
        str += 'FLOAT'
    } else if ('double' == dataType) {
        str += 'DOUBLE'
    } else if ('decimal' == dataType) {
        str += 'DECIMAL'
    } else if ('text' == dataType) {
        str += 'TEXT'
    }

    return str;
}

let dataBaseService = new DataBaseService();

module.exports = dataBaseService