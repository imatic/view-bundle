/**
 * Regular expression helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */

var regexEscape = /[-\/\\^$*+?.()|[\]{}]/g;

/**
 * Escape a string for usage in a RegEx pattern
 *
 * @param {String} s
 * @returns {String}
 */
export function escape(s)
{
    return s.replace(regexEscape, '\\$&');
}
