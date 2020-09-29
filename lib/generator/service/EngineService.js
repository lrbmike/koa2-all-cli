const dataBaseService = require('./DataBaseService')
const templateService = require('./TemplateService')
const fileService = require('./FileService')

class EngineService {

    constructor(opts) {
        this.opts = opts || {}

        this.table_prefix = this.opts.table_prefix || ''
    }

    async framework(projectName, include) {

        projectName = projectName || 'koa2-framework'
        //初始化输出目录
        await fileService.initFrameworkOutput(projectName)

        //模板参数设置
        templateService.setOthers({
            'table_prefix': this.table_prefix,
            'project_name': projectName,
            'output_type': 1
        })

        let tables = [];
        if (include.toLowerCase() == 'all') {//获取库中全部数据表

            tables = await dataBaseService.showTables();

        } else if (include.length > 0) {//指定数据表
            //获取库中全部数据表
            tables = include.split('##')
        }

        for (let i=0; i<tables.length; i++) {
            let tableName = tables[i];
            let tableColumns = await dataBaseService.showTableColumns(tableName);
            //生成schema文件
            await templateService.schema(tableName, tableColumns, this.table_prefix)
            //生成model文件
            await templateService.model(tableName, tableColumns, this.table_prefix)
            //生成service文件
            await templateService.service(tableName, this.table_prefix)
        }


    }

    async tables(tablesName) {

        //初始化输出目录
        await fileService.initTablesOutput();

        //模板参数设置
        templateService.setOthers({
            'table_prefix': this.table_prefix,
            'project_name': this.project_name,
            'output_type': 2
        })

        let tableArr = tablesName.split('##');

        for (let i=0; i<tableArr.length; i++) {
            let tableName = tableArr[i];
            let tableColumns = await dataBaseService.showTableColumns(tableName);
            //生成schema文件
            await templateService.schema(tableName, tableColumns, this.table_prefix)
            //生成model文件
            await templateService.model(tableName, tableColumns, this.table_prefix)
            //生成service文件
            await templateService.service(tableName, this.table_prefix)
        }
        //复制base文件
        await templateService.copyBase()

    }

}

module.exports = EngineService