"use_strict";

var Imatic;
(function (Imatic) {
    (function (View) {
        (function (Collection) {

            var prototypeMap = {};
            var regexEscape = /[-\/\\^$*+?.()|[\]{}]/g;

            /**
             * @param {Array} foundFieldList
             */
            function initFields(foundFieldList)
            {
                for (var i = 0; i < foundFieldList.length; ++i) {
                    foundFieldList[i].field.initializer($(foundFieldList[i].element));
                }
            }

            /**
             * @param {Array}       prototypeList
             * @param {HTMLElement} collection
             * @param {HTMLElement} row
             * @returns {Array}
             */
            function findFields(prototypeList, collection, row)
            {
                var elements = $('*[id]', row);

                var field;
                var results = [];

                for (var i = 0; i < elements.length; ++i) {
                    var parent = $(elements[i]).parents('div.collection-item')[0];

                    if (
                        $(row).is(parent)
                        && (field = matchField(collection, elements[i], prototypeList))
                    ) {
                        results.push({element: elements[i], field: field});
                    }
                }

                return results;
            }

            /**
             * @param {Object} field
             * @returns {RegExp}
             */
            function getFieldRegex(field)
            {
                if (!field.regex) {
                    var pattern = escapeForRegex(field.id);
                    
                    pattern = pattern.replace(field.prototypeName, '(\\d+)');
                    
                    for (var i = 0; i < field.parentPrototypeNames.length; ++i) {
                        pattern = pattern.replace(field.parentPrototypeNames[i], '(\\d+)');
                    }
                    
                    field.regex = new RegExp('^' + pattern + '$');
                }
                
                return field.regex;
            }

            /**
             * @param {HTMLElement} collection
             * @param {HTMLElement} element
             * @param {Array}       prototypeList
             * @returns {Object|null}
             */
            function matchField(collection, element, prototypeList)
            {
                for (var i = 0; i < prototypeList.length; ++i) {

                    if (
                        prototypeList[i].collection === collection
                        && getFieldRegex(prototypeList[i]).test(element.id)
                    ) {
                        return prototypeList[i];
                    }
                }

                return null;
            }

            /**
             * @param {String} s
             * @returns {String}
             */
            function escapeForRegex(s)
            {
                return s.replace(regexEscape, '\\$&');
            }

            Collection.attachEventHandlers = function () {
                $(window).on('add.mopa-collection-item', Collection.onAddItem);
            };

            /**
             * @param {Array}       fields
             * @param {HTMLElement} collection
             */
            Collection.registerPrototypeFields = function (fields, collection) {
                Collection.cleanupPrototypeFields();

                for (var i = 0; i < fields.length; ++i) {
                    if (!(fields[i].prototypeName in prototypeMap)) {
                        prototypeMap[fields[i].prototypeName] = [];
                    }

                    var field = $.extend({collection: collection}, fields[i]);

                    prototypeMap[fields[i].prototypeName].push(field);
                }
            };
            
            /**
             * Remove all prototype fields
             */
            Collection.resetPrototypeFields = function () {
                prototypeMap = {};
            };

            /**
             * Remove prototype fields whose collection element is no longer
             * present in the document
             */
            Collection.cleanupPrototypeFields = function () {
                for (var prototypeName in prototypeMap) {
                    if (prototypeMap.hasOwnProperty(prototypeName)) {
                        var toRemove = [];
                        
                        for (var i = 0; i < prototypeMap[prototypeName].length; ++i) {
                            if (!$.contains(document.documentElement, prototypeMap[prototypeName][i].collection)) {
                                toRemove.push(i);
                            }
                        }

                        if (toRemove.length === prototypeMap[prototypeName].length) {
                            delete prototypeMap[prototypeName];
                        } else if (toRemove.length > 0) {
                            prototypeMap[prototypeName] = $.grep(prototypeMap[prototypeName], function (v, k) {
                                return -1 === toRemove.indexOf(k);
                            });

                            if (0 === prototypeMap[prototypeName].length) {
                                delete prototypeMap[prototypeName];
                            }
                        }
                    }
                }
            };

            /**
             * @param {Event}  event
             * @param {jQuery} $collection
             * @param {jQuery} $row
             * @param {Number} index
             */
            Collection.onAddItem = function (event, $collection, $row, index) {
                var prototypeName = $collection.data('prototype-name') || '__name__';

                if (prototypeMap[prototypeName]) {
                    var foundFields = findFields(prototypeMap[prototypeName], $collection[0], $row[0]);
                    
                    initFields(foundFields);
                }
            };

        })(View.Collection || (View.Collection = {}));
    })(Imatic.View || (Imatic.View = {}));
})(Imatic || (Imatic = {}));

$(function () {
    Imatic.View.Collection.attachEventHandlers();
});
