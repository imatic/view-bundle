"use_strict";

/**
 * Bootstrap datepicker configuration
 *
 * @param {jQuery} $
 */
void function ($) {

    var lang = $('html').attr('lang');

    if (lang) {
        $.fn.datepicker.defaults.language = lang;
    }
    $.fn.datepicker.defaults.autoclose = true;

}(jQuery);
