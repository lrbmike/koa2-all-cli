const _ = require('lodash')
const Router =  require('koa-router')

module.exports = (opts) => {

    let options = {
        routesPath: process.cwd()+'/config/routes.js',
        controllerPath: process.cwd()+'/app/controllers/{controller}.js'
    };

    if (opts && opts.routesPath){
        options.routesPath = opts.routesPath;
    }

    if (opts && opts.controllerPath){
        options.controllerPath = opts.controllerPath;
    }
    let routes = require(options.routesPath);
    let routerPathKeys = _.keys(routes);

    const router = new Router();

    for (const routeKey of routerPathKeys){
        const [verb, url] = routeKey.split(' ');
        const routeValue = routes[routeKey];
        if (routeValue[0] === '/') {
            router.redirect(url, routeValue, 301);
        }else {
            const [controllerPath, action] = routeValue.split('#');
            const controller = require(options.controllerPath.replace('{controller}', controllerPath));
            if (controller){
                const actionInstance = controller[action];
                if (actionInstance){
                    router[verb](url, actionInstance);
                }else{
                    throw new Error('Unable to find controller action for route:' + routeKey);
                }
            }else {
                throw new Error('Unable to find controller for route:' + routeKey);
            }
        }

    }

    return router.routes();
}
