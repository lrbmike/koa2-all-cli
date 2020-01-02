# koa2-all-cli
code scaffold for `koa@2` , contains orm framework that can auto-generated models、schema and service
## Usage
1. clone this repository<br>
``` 
git clone https://github.com/lrbmike/koa2-all-cli.git
cd koa2-all-cli
npm install
``` 
2. modify your db setting<br>
``` 
vim ./config/db.json
``` 
3. run<br>
 ``` 
node ./bin/koa2cli.js -t your_table_name
or
node ./bin/koa2cli.js -f your_project_name

Options:
-t, --tables [tables]  generate tables, multiple use "##"
-f, --framework [name]  generate koa2 framework, input your project name
--prefix [prefix]      table prefix
 ``` 
the code will create in the `output` directory
