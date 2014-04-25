"use_strict";

/**
 * Bootstrap datepicker configuration
 *
 * @param {jQuery} $
 */
void function ($) {

    var lang = $('html').attr('lang');

    // set defaults
    // http://bootstrap-datepicker.readthedocs.org/en/release/options.html
    if (lang) {
        $.fn.datepicker.defaults.language = lang;
    }
    $.fn.datepicker.defaults.weekStart = 1;
    $.fn.datepicker.defaults.autoclose = true;
    $.fn.datepicker.defaults.todayHighlight = true;
    $.fn.datepicker.defaults.todayBtn = 'linked';
    $.fn.datepicker.defaults.clearBtn = true;

    // on ready
    $(document).ready(function () {
        // missing CS translations
        if ('cs' === lang && $.fn.datepicker.dates['cs']) {
            // https://github.com/eternicode/bootstrap-datepicker/pull/817
            if (!$.fn.datepicker.dates['cs'].clear) {
                $.fn.datepicker.dates['cs'].clear = 'Vymazat';
            }
        }
    });

}(jQuery);
