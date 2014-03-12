/// <reference path="document.ts"/>

/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify {

    "use_strict";

    import HTMLDocumentHandler  = imatic.view.ajaxify.document.HTMLDocumentHandler;

    export function init(document: HTMLDocument)
    {
        var handler = new HTMLDocumentHandler(document);

        handler.attach();
    }

}

declare var document: HTMLDocument;

imatic.view.ajaxify.init(document);
