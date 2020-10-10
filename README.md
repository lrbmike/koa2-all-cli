# koa2-all-cli
code scaffold for `koa@2` , contains orm framework that can auto-generated models、schema and service
## Usage
1、 clone this repository<br>
``` 
git clone https://github.com/lrbmike/koa2-all-cli.git
cd koa2-all-cli
npm install
``` 
2、 modify your db setting<br>
``` 
vim ./config/db.json
``` 
3、 run<br>
 ``` 
node ./bin/koa2cli.js -t your_table_name
or
node ./bin/koa2cli.js -f your_project_name

Options:
-t, --tables [tables]  generate tables, multiple use "##"
-f, --framework [name]  generate koa2 framework, input your project name
-i, --include [tables] generate framework and include input tables, multiple use "##"
--prefix [prefix]      table prefix
 ``` 
the code will create in the `output` directory

## Project

* **db setting**

you need to modify your db setting `db.json`, the file is in the `config` directory<br>

* **redis setting**

if you want to use redis service(default create), you need to modify your redis setting `redis.json`, the file is in the `config` directory<br>

or you can delete this file, and delete `RedisService.js`, the file is in the `service` directory<br>