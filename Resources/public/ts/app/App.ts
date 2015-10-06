/**
 * Get current application locale
 */
export function getLocale(): string
{
    return document.documentElement.getAttribute('lang');
}

/**
 * Get base application path
 */
export function getBasePath(): string
{
    return document.documentElement.getAttribute('data-base-path');
}
