import "babel-polyfill";

// jQuery
import "jquery";

// Bootstrap
import "bootstrap";

// Bootstrap notify
import "bootstrap-notify";

// Bootstrap datetime picker
import "./js/datetimepicker";

// Select2
import "select2/dist/js/select2.js";

// Platform - view
import "./ts/ajaxify/Ajaxify.ts";
import "./ts/ajaxify/Extras/BootstrapNotify.ts";
import "./ts/toggle/Toggle.ts";
import "expose-loader?Imatic!./js/Imatic.js";
import "expose-loader?Imatic.View!./js/View.js";

// Form bundle
import "expose-loader?Imatic.Form!imatic/form-bundle/Resources/public/js/Form";

$(function() {
    // file upload - the name of the file appear on select
    $(document).on("change", '.custom-file-input', function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
});
