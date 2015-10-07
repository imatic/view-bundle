/**
 * Application helpers
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
export default {
    /**
     * Get current application locale
     *
     * @returns {String}
     */
    getLocale: function () {
        return document.documentElement.getAttribute('lang');
    },

    /**
     * Get base application path
     *
     * @returns {String}
     */
    getBasePath: function () {
        return document.documentElement.getAttribute('data-base-path');
    }
}
