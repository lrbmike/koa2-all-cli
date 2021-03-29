const template = require('art-template');
const path = require('path')
const S = require('string')

const fileService = require('./FileService')

class TemplateService {

    constructor(opts) {
        this.opts = opts || {}

        this.project_name = this.opts.project_name || 'koa2-framework'
        this.table_prefix = this.opts.table_prefix || ''
        this.output_type = this.opts.output_type || 1
    }

    setOthers(others) {
        this.others = others || {}

        this.project_name =  this.others.project_name || this.project_name
        this.table_prefix = this.others.table_prefix || this.table_prefix
        this.output_type = this.others.output_type || this.output_type

        if (1 == this.output_type) {//framework
            this.output_schema_path = process.cwd() + '/output/' + this.project_name + '/app/schema/'
            this.output_model_path = process.cwd() + '/output/' + this.project_name + '/app/models/'
            this.output_service_path = process.cwd() + '/output/' + this.project_name + '/app/service/sys/'
        } else if (2 == this.output_type) {//tables
            this.output_schema_path = process.cwd() + '/output/tables/schema/'
            this.output_model_path = process.cwd() + '/output/tables/models/'
            this.output_service_path = process.cwd() + '/output/tables/service/'
        }

    }

    async schema(tableName, columns, tablePrefix) {

        let className = getClassName(tableName, tablePrefix);

        let templateFilePath = path.join(__dirname, '../template/schema.art')

        let html = template(templateFilePath, {
            'tableName': tableName,
            'columns': columns,
            'className': className
        });

        let fileName = className + '.js';
        await fileService.write(html, this.output_schema_path, fileName);

    }

    async model(tableName, columns, tablePrefix) {

        let className = getClassName(tableName, tablePrefix);

        let templateFilePath = path.join(__dirname, '../template/model.art')

        let columnStr = getColumnStr(columns);

        let html = template(templateFilePath, {
            'columnStr': columnStr,
            'className': className
        });

        let fileName = className + 'Model.js';
        await fileService.write(html, this.output_model_path, fileName);
    }

    async copyBase () {
        let outputPath = process.cwd() + '/output/';
        let libPath = process.cwd() + '/lib/';
        //model
        let modelSrc = libPath + 'generator/models/BaseModel.js'
        let modelDist = outputPath + 'tables/models/BaseModel.js'
        await fileService.copyFile(modelSrc, modelDist);
    }

    async service(tableName, tablePrefix) {

        let className = getClassName(tableName, tablePrefix);

        let templateFilePath = path.join(__dirname, '../template/service.art')

        let html = template(templateFilePath, {
            'className': className
        });

        let fileName = className + 'Service.js';
        await fileService.write(html, this.output_service_path, fileName);
    }

}

function getClassName(tableName, tablePrefix) {
    if (S(tablePrefix).isEmpty() == false) {
        tableName = tableName.replace(tablePrefix, '');
    }else {
        tableName = '_' + tableName
    }

    let className = S(tableName).capitalize().camelize().s

    return className
}

function getColumnStr(columns) {
    let arr = new Array();
    arr.push("'id'");

    let columnsLength = columns.length;
    for (let i=0; i<columnsLength; i++){
        let columnObj = columns[i];
        arr.push('\'' + columnObj.columnName + '\'')
    }

    return arr.join(', ');
}

let templateService = new TemplateService();

module.exports = templateService