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
         */
        off: function (event, context) {
            // console.info(event, context);
            if(event.indexOf('.') === -1) {
                let masEvent = event.split('.');
                let masKey = Object.keys(events);
                masKey.forEach(function (key) {
                    if (key === masEvent || key.indexOf(masEvent[0] + '.') !== -1) {
                        deleteEvent(key, context);
                    }
                });
            }
            deleteEvent(event, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            // console.info(event);
            let splitEvent = event.split('.');
            let masEvents = [event];
            if (splitEvent.length !== 1) {
                masEvents.push(splitEvent[0]);
            } 
            masEvents.forEach(function (item) {
                if (events[item] !== undefined) {
                    doEmit(item);
                }
            });

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
            // console.info(event, context, handler, times);
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
            // console.info(event, context, handler, frequency);
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
