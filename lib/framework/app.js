const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');

const app = new Koa();

//session
const session = require("koa-session2");
app.use(session({
    key: 'koa-all-framework'
}))

//静态目录
const serve = require('koa-static');
app.use(serve(__dirname + '/public'));

//view层
render(app, {
    root: path.join(__dirname, '/public/views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

//form-data表单解析
/**
 * 控制层获取方式
 * let {body, files} = ctx.request
 */
const formidable = require('koa2-formidable');
const formOpt = {
    uploadDir: 'uploads/'
};
app.use(formidable(formOpt));
//body解析
const bodyparser = require('koa-bodyparser');
app.use(bodyparser());

app.proxy = true;

//路由
const routes = require('./app/middleware/routes');
app.use(routes());

app.listen(9012);