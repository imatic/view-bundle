/**
 * Regular expression helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */

/**
 * Escape a string for usage in a RegEx pattern
 *
 * @param {String} s
 * @returns {String}
 */
function escape(s)
{
    return s.replace(regexEscape, '\\$&');
}

var regexEscape = /[-\/\\^$*+?.()|[\]{}]/g;

// exports
export {
    escape
}
