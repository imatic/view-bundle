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
export function getLocale()
{
    return document.documentElement.getAttribute('lang') || '';
}

/**
 * Get base application path
 *
 * @returns {String}
 */
export function getBasePath()
{
    return document.documentElement.getAttribute('data-base-path') || '';
}
