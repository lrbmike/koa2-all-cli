const log4js = require('log4js');

class Logger {

    constructor() {
        log4js.configure({
            appenders: {
                out: { type: 'stdout' },
                app: { type: 'dateFile', filename: 'logs/app.log', pattern: '.yyyy-MM-dd', compress: true}
            },
            categories: {
                default: { appenders: [ 'out', 'app' ], level: 'debug' }
            }
        });
    }

    getLogger() {
        return log4js.getLogger('logger');
    }

}

let logger = new Logger();

module.exports = logger.getLogger()