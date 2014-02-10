/// <reference path="document.ts"/>

module imatic.view.ajaxify {

    import HTMLDocumentHandler = imatic.view.ajaxify.document.HTMLDocumentHandler;

    export function init(document: HTMLDocument, jQuery: any)
    {
        var handler = new HTMLDocumentHandler(document, jQuery);
        
        handler.attach();
    }

}

declare var document: HTMLDocument;
declare var jQuery: any;

imatic.view.ajaxify.init(document, jQuery);
