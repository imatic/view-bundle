// jQuery
require('expose?jQuery!jquery');
require('expose?$!jquery');

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

// Platform - view
require('./../../public/ts/ajaxify/Ajaxify.ts');
require('./../../public/ts/ajaxify/Extras/BootstrapNotify.ts');
require('./../../public/ts/toggle/Toggle.ts');
require('expose?Imatic!./../../public/js/Imatic.js');
require('expose?Imatic.View!./../../public/js/View.js');

// Form bundle
require('expose?Imatic.Form!./../../../../form-bundle/Resources/public/js/Form.js');
