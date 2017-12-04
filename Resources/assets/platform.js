import "babel-polyfill";

// jQuery
import "jquery";

// Bootstrap
import "bootstrap";

// Bootstrap notify
import "bootstrap-notify";

// Bootstrap datetime picker
import "eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js";

// Select2
import "select2/dist/js/select2.js";
import "./js/select2/select2-focus-war-fix.js";

// Platform - view
import "./ts/ajaxify/Ajaxify.ts";
import "./ts/ajaxify/Extras/BootstrapNotify.ts";
import "./ts/toggle/Toggle.ts";
import "expose-loader?Imatic!./js/Imatic.js";
import "expose-loader?Imatic.View!./js/View.js";

// Form bundle
import "expose-loader?Imatic.Form!imatic/form-bundle/Resources/public/js/Form";
