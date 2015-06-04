"use_strict";

var Imatic;
(function (Imatic) {
    (function (View) {
        (function (Datepicker) {

            // https://github.com/smalot/bootstrap-datetimepicker#options
            Datepicker.defaults = {
                base: {
                    autoclose: true,
                    pickerPosition: 'bottom-left',
                    todayBtn: true
                },
                datepicker: {
                    format: 'dd/mm/yyyy',
                    minView: 'month',
                    startView: 'month'
                },
                datetimepicker: {
                    format: 'dd/mm/yyyy hh:ii'
                },
                timepicker: {
                    format: 'hh:ii',
                    formatViewType: 'time',
                    maxView: 'day',
                    minView: 'hour',
                    startView: 'day'
                }
            };

            // https://github.com/naitsirch/mopa-bootstrap-bundle/blob/master/Resources/doc/3.3-form-components.md
            Datepicker.init = function ($field, language) {
                var $elem = $field.parent('div.date');

                if ($elem.length < 1) {
                    throw new Error('Datepicker element was not found');
                }

                var options = $.extend(
                    {language: language},
                    Datepicker.defaults.base,
                    Datepicker.defaults[$elem.data('provider')]
                );

                $elem.datetimepicker(options);
                
                $elem.find('input[type=hidden]').each(function () {
                    if ($(this).val()) {
                        $(this).parent().datetimepicker('setValue');
                    }
                });
            };

        })(View.Datepicker || (View.Datepicker = {}));
    })(Imatic.View || (Imatic.View = {}));
})(Imatic || (Imatic = {}));
