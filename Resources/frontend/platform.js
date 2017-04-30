// jQuery
require('expose-loader?jQuery!jquery');
require('expose-loader?$!jquery');

// Bootstrap
require('bootstrap');

// Bootstrap notify
require('bootstrap-notify');

// Bootstrap datetime picker
require('eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js');

// Select2
require('select2/dist/js/select2.js');
require('select2/dist/js/i18n/cs.js');
require('select2/dist/js/i18n/en.js');
require('./js/select2/select2-focus-war-fix.js');

// Platform - view
require('./ts/ajaxify/Ajaxify.ts');
require('./ts/ajaxify/Extras/BootstrapNotify.ts');
require('./ts/toggle/Toggle.ts');
require('expose-loader?Imatic!./js/Imatic.js');
require('expose-loader?Imatic.View!./js/View.js');

// Form bundle
require('expose-loader?Imatic.Form!../../vendor/imatic/form-bundle/Resources/public/js/Form.js');
