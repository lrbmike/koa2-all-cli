const moment = require('moment')
const S = require('string')

class TimeHelper {

    constructor() {
        moment.locale('zh-cn', {
            week : {
                dow : 1 // Monday is the first day of the week
            }
        })
    }

    getDateTimeStr(date) {
        let datetime = moment(date);
        let datetimeStr = datetime.format('YYYYMMDD');
        return datetimeStr
    }

    getDateTime(datetimeStr) {
        if (S(datetimeStr).isEmpty()) {
            return moment();
        }
        return moment(new moment(datetimeStr).format("YYYY-MM-DD"));
    }

    getFrontMidDateTimeStr(date) {
        let datetime = moment(date);
        let datetimeStr = datetime.format('YYYY-MM-DD HH:mm');
        return datetimeStr
    }

}
let helper = new TimeHelper();

module.exports = helper