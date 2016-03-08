(function (exports) {

    var util = (function () {

        var toString = Object.prototype.toString;

        return {

            isString: function (s) {
                return toString.call(s) === '[object String]';
            },

            isFunction: function (f) {
                return toString.call(f) === '[object Function]';
            },

            isObject: function (o) {
                return toString.call(o) === '[object Object]';
            }
        };
    })();

    function EventEmitter () {
        this.__events = {};
    };

    EventEmitter.prototype.addEventListener = function (type, handler, one) {

        if (!type || !handler) {
            return;
        }

        this.__events[type] = this.__events[type] || [];
        var handlers = this.__events[type];

        var has;

        for (var item of handlers) {
            if (item.h == handler) {
                has = true;
                break;
            }
        }

        if (!has) {
            handlers.push({h: handler, one});
        }
    };

    EventEmitter.prototype.removeEventListener = function (type, handler) {
        if ( !type && !handler ) {
            this.__events = {};
            return;
        }

        if (!handler) {
            delete this.__events[type];
            return;
        }

        var handlers = this.__events[ type ] || [];

        var item, index = 0;

        while (index < handlers.length) {

            item = handlers[index];

            if (handler === item.h ) {
                handlers.splice(index, 1);
            } else {
                index++;
            }
        }
    };

    EventEmitter.prototype.emit = function (type, data) {

        if (!type) {
            return;
        }

        var handlers = this.__events[ type ] || [];
        var handlerWrap, h, index = 0;

        while (index < handlers.length) {

            item = handlers[index];
            h = item.h;

            if (isFunction(h)) {
                h.call(null, data, type);
            } else if (isObject(h) && isFunction(h.handleEvent)) {
                h.handleEvent.call(h, type, data);
            }

            if (item.one) {
                handlers.splice(index, 1);
            } else {
                index++;
            }
        }
    };

    EventEmitter.prototype.one = function (type, handler) {
        this.addEventListener(type, handler, true);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;
    EventEmitter.prototype.off = EventEmitter.prototype.removeEventListener

    exports.EventEmitter = EventEmitter;

})(this);
