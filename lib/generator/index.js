const EngineService = require('./service/EngineService')


module.exports = async (opts) => {

	let model = opts.model
	if ('table' == model) {
        let _opts = {'table_prefix': opts.table_prefix || ''}
        let engineService = new EngineService(_opts);
        await engineService.tables(opts.table_names);

	} else if ('framework' == model) {
        let _opts = {'table_prefix': opts.table_prefix || ''}
        let engineService = new EngineService(_opts);
        await engineService.framework(opts.project_name, opts.include);

	}


}