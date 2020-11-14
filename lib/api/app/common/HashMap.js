module.exports = function HashMap() {

    let size = 0;
    let entry = new Object();

    this.put = function (key, value) {
        entry[key] = value;
        size++;
    };

    this.putAll = function (map) {
        if (typeof map == "object" && !map.sort) {
            let keys = map.keySet();
            for (let i=0; i<keys.length; i++) {
                let key = keys[i];
                this.put(key, map.get(key));
            }
        } else {
            throw "输入类型不正确，必须是HashMap类型！";
        }
    };

    this.get = function (key) {
        return entry[key];
    };

    this.remove = function (key) {
        if (size == 0)
            return;
        delete entry[key];
        size--;
    };

    this.containsKey = function (key) {
        if (entry[key]) {
            return true;
        }
        return false;
    };

    this.containsValue = function (value) {
        for (var key in entry) {
            if (entry[key] == value) {
                return true;
            }
        }
        return false;
    };

    this.clear = function () {
        entry = new Object();
        size = 0;
    };

    this.isEmpty = function () {
        return size == 0;
    };

    this.size = function () {
        return size;
    };

    this.keySet = function () {
        let keys = new Array();
        for (let key in entry) {
            keys.push(key);
        }
        return keys;
    };

    this.entrySet = function () {
        let entrys = new Array();
        for (let key in entry) {
            let et = new Object();
            et[key] = entry[key];
            entrys.push(et);
        }
        return entrys;
    };

    this.values = function () {
        let values = new Array();
        for (let key in entry) {
            values.push(entry[key]);
        }
        return values;
    };

    this.each = function (cb) {
        for (let key in entry) {
            cb.call(this, key, entry[key]);
        }
    };

    this.toString = function () {
        return obj2str(entry);
    };

    function obj2str(o) {
        let r = [];
        if (typeof o == "string")
            return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            for (let i in o)
                r.push("\"" + i + "\":" + obj2str(o[i]));
            if (!!document.all && !/^\n?function\s*toString\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
            return r;
        }
        return o.toString();
    }
}