#!/usr/bin/env node

const program = require('commander');

const generator = require('../lib/generator')

program
  .version('v' + require('../package').version)
	.description('koa2 framework auto build');


program.option('-t, --tables [tables]', 'generate tables, multiple use "##"')
    .option('--prefix [prefix]', 'table prefix')
    .parse(process.argv);

if (program.tables) {
    console.log('your generate tables are:');
    console.log(program.tables);
    generatorGo(program.tables, program.prefix)
}

async function generatorGo(tables, prefix) {
	let opts = {'table_names': tables, 'table_prefix':prefix}
    await generator(opts)
}