/**
 * Regular expression helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
export default {
    /**
     * Escape a string for usage in a RegEx pattern
     *
     * @param {String} s
     * @returns {String}
     */
    escape: function (s) {
        return s.replace(regexEscape, '\\$&');
    },
}

var regexEscape = /[-\/\\^$*+?.()|[\]{}]/g;
