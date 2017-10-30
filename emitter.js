'use strict';

/**
 * неСделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

let formEvent = {
    context: undefined,
    handler: undefined
};

let events = {};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    events = {};

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
                if (key === event || key.indexOf(event + '.') !== -1) {
                    deleteEvent(key, context);
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
                partsEvent += '.' + item;

                return partsEvent.slice(1, partsEvent.length);
            });
            for (let i = splitEvent.length - 1; i >= 0; i--) {
                if (events[splitEvent[i]] !== undefined) {
                    doEmit(splitEvent[i]);
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function deleteEvent(key, context) {
    events[key] = events[key].filter(function (item) {

        return item.context !== context;
    });
}

function doEmit(event) {
    events[event].forEach(function (item) {
        item.handler.call(item.context);
    });
}
