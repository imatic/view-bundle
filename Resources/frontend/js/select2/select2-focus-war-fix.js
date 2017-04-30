// https://github.com/select2/select2/pull/2176
// (bug most likely reintroduced in v4.0.0)
$(function () {
    $('body').on('focus', '.select2-dropdown', function (e) {
        e.stopPropagation();
    });
});
