#!/usr/bin/env node

const program = require('commander');

const generator = require('../lib/generator')

program
  .version('v' + require('../package').version)
	.description('koa2 framework auto build');


program.option('-t, --tables [tables]', 'generate tables, multiple use "##"')
    .option('--prefix [prefix]', 'table prefix')
    .option('-f, --framework [name]', 'generate framework, input your project name')
    .parse(process.argv);

if (program.tables) {
    console.log('your generate tables are:');
    console.log(program.tables);
    generatorGo(program.tables, program.prefix)
}

async function generatorGo(tables, prefix) {
	let opts = {'table_names': tables, 'table_prefix':prefix, 'model': 'table'}
    await generator(opts)
}

if (program.framework) {
    console.log('your project name is:');
    console.log(program.framework);
    frameworkGo(program.framework, program.prefix)
}

async function frameworkGo(projectName, prefix) {
    let opts = {'project_name': projectName, 'table_prefix':prefix, 'model': 'framework'}
    await generator(opts)
}