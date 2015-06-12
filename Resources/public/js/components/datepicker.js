"use_strict";

var Imatic;
(function (Imatic, $) {
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

            Datepicker.html5TypeMap = {
                'date': {type: 'datepicker', format: 'yyyy-mm-dd'},
                'datetime': {type: 'datetimepicker', format: 'yyyy-mm-dd hh:ii'},
                'datetime-local': {type: 'datetimepicker', format: 'yyyy-mm-dd hh:ii'},
                'time': {type: 'timepicker', format: 'hh:ii'}
            };

            function fixTranslations(language)
            {
                if (0 === $.fn.datetimepicker.dates[language].meridiem.length) {
                    $.fn.datetimepicker.dates[language].meridiem = ['', ''];
                }
            }

            // https://github.com/naitsirch/mopa-bootstrap-bundle/blob/master/Resources/doc/3.3-form-components.md
            Datepicker.init = function ($field, language) {
                fixTranslations(language);

                var $wrapper = $field.parent('div.date');
                var $target = $wrapper.length < 1 ? $field : $wrapper;

                var type, format;

                if ($wrapper.length > 0) {
                    // wrapped fields
                    type = $target.data('provider');
                } else {
                    // plain HTML5 input
                    var html5Type = Datepicker.html5TypeMap[$field.attr('type')];

                    if (html5Type) {
                        type = html5Type.type;
                        format = html5Type.format;

                        // change the input type to "text" to prevent
                        // browser's implementation from interfering
                        $target.attr('type', 'text');
                    }
                }

                if (type) {
                    var options = $.extend(
                        {language: language},
                        Datepicker.defaults.base,
                        Datepicker.defaults[type],
                        {format: format}
                    );

                    $target.datetimepicker(options);

                    if ($wrapper.length > 0) {
                        $wrapper.find('input[type=hidden]').each(function () {
                            if ($(this).val()) {
                                $(this).parent().datetimepicker('setValue');
                            }
                        });
                    }
                }
            };

        })(View.Datepicker || (View.Datepicker = {}));
    })(Imatic.View || (Imatic.View = {}));
})(Imatic || (Imatic = {}), jQuery);
