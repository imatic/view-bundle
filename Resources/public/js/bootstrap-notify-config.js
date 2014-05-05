"use_strict";

/**
 * Bootstrap notify configuration
 *
 * @param {jQuery} $
 */
void function ($) {

    $(document).ready(function () {
        // prevent the browser from following the "#" href on close links
        $('#notifications').on('click', 'a.close', function () {
            return false;
        });
    });

}(jQuery);
