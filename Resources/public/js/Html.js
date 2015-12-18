/**
 * HTML helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */

/**
 * Escape a string for HTML
 *
 * @param {String} s
 * @returns {String}
 */
function escape(s)
{
    return s.replace(escapeRgxp, replaceHtmlChar);
}

/**
 * Render a class list
 *
 * @param {Array}   classes array of class names
 * @param {Boolean} sparate prepend a space if the class list is not empty 1/0
 * @returns {String}
 */
function classList(classes, separate = true)
{
    if (classes && classes.length > 0) {
        return (separate ? ' ' : '') + this.escape(classes.join(' '));
    }

    return '';
}

/**
 * Expand template variables in a template
 *
 * E.g. "Hello {{name}}"
 *
 * The replacements will be escaped.
 *
 * @param {String} template
 * @param {Object} variables
 * @returns {String}
 */
function expand(template, variables)
{
    return template.replace(templateExpansionRgxp, (match, variable) => {
        if (variables[variable] === void 0) {
            throw new Error('Template variable "' + variable + '" is not defined');
        }

        return this.escape(String(variables[variable]));
    });
}

/**
 * Expand template variables in a template and return it as a jQuery object
 *
 * @param {String} template
 * @param {Object} variables
 * @returns {jQuery}
 */
function render(template, variables)
{
    return $($.parseHTML(this.expand(template, variables)));
}

/**
 * @param {String} s
 * @returns {String}
 */
function replaceHtmlChar(s)
{
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

var templateExpansionRgxp = /\{\{(?=([\w.]+))\1\}\}/g;

// exports
export {
    escape,
    classList,
    expand,
    render,
}
