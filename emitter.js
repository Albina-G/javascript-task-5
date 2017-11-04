'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

const formEvent = {
    context: undefined,
    handler: undefined
};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            // console.info(event, context, handler);
            if (events[event] === undefined) {
                events[event] = [];
            }
            let newEvent = Object.create(formEvent);
            newEvent.context = context;
            newEvent.handler = handler;
            events[event].push(newEvent);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            // console.info(event, context);
            let masKey = Object.keys(events);
            masKey.forEach(function (key) {
                if (key === event || key.indexOf(event + '.') === 0) {
                    events = deleteEvent(key, context, events);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            // console.info(event);
            let partsEvent = '';
            let splitEvent = event.split('.').map(function (item) {
                partsEvent += item + '.';

                return partsEvent.slice(0, -1);
            });
            for (let i = splitEvent.length - 1; i >= 0; i--) {
                if (events[splitEvent[i]] !== undefined) {
                    events = doEmit(splitEvent[i], events);
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            // console.info(event, context, handler, times);
            if (times <= 0) {

                return this.on(event, context, handler);
            }
            let iteration = 0;

            return this.on(event, context, function () {
                iteration++;
                handler.call(context);
                if (iteration === times) {
                    events = deleteEvent(event, context, events);
                }
            });
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            // console.info(event, context, handler, frequency);
            if (frequency <= 0) {

                return this.on(event, context, handler);
            }

            let iteration = 0;

            return this.on(event, context, function () {
                if (iteration === 0) {
                    handler.call(context);
                }
                iteration++;
                if (iteration === frequency) {
                    iteration = 0;
                }
            });
        }
    };
}

function deleteEvent(key, context, events) {
    events[key] = events[key].filter(function (item) {

        return item.context !== context;
    });

    return events;
}

function doEmit(event, events) {
    events[event].forEach(function (item) {
        item.handler.call(item.context, item);
    });

    return events;
}
