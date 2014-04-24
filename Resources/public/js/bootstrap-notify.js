"use_strict";

/**
 * Bootstrap notify utility
 *
 * @param {jQuery} $
 */
void function ($) {

    $(document).ready(function () {
        $('#notifications').on('click', 'a.close', function () {
            return false;
        });
    });

}(jQuery);
