/**
 * Application helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */

/**
 * Get current application locale
 *
 * @returns {String}
 */
function getLocale()
{
    return document.documentElement.getAttribute('lang');
}

/**
 * Get base application path
 *
 * @returns {String}
 */
function getBasePath()
{
    return document.documentElement.getAttribute('data-base-path');
}

// exports
export {
    getLocale,
    getBasePath,
}
