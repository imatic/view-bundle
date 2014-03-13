/// <reference path="document.ts"/>

/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify {

    "use_strict";

    import HTMLDocumentHandler = imatic.view.ajaxify.document.HTMLDocumentHandler;

    var handler;

    /**
     * Initialize ajaxify
     */
    export function init(document: HTMLDocument)
    {
        handler = new HTMLDocumentHandler(document);

        handler.attach();
    }

    /**
     * Get document handler instance
     */
    export function getDocumentHandler(): HTMLDocumentHandler {
        return handler;
    }
}

declare var document: HTMLDocument;

imatic.view.ajaxify.init(document);
