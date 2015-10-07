/**
 * HTML helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
export default {
    /**
     * Escape a string for HTML
     *
     * @param {String} s
     * @returns {String}
     */
    escape: function (s) {
        return s.replace(escapeRgxp, replaceHtmlChar);
    }
}

/**
 * @param {String} s
 * @returns {String}
 */
function replaceHtmlChar(s) {
    return htmlCharMap[s];
}

var escapeRgxp = /[&<>"'\/]/g;
var htmlCharMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
};
