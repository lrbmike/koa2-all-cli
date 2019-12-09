const EngineService = require('./service/EngineService')


module.exports = async (opts) => {

	let _opts = {'table_prefix': opts.table_prefix || ''}
	let engineService = new EngineService(_opts);
	//
	await engineService.tables(opts.table_names);
}