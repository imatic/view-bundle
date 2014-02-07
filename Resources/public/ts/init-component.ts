
declare var document: HTMLDocument;
declare var jQuery;
declare var imatic;

void (function (document, jQuery) {

    var htmlDocumentHandler = new imatic.view.component.HTMLDocumentHandler(document, jQuery);
    
    htmlDocumentHandler.attach();

})(document, jQuery);
