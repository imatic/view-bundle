
declare var document: HTMLDocument;
declare var jQuery;
declare var imatic;

void (function (document, jQuery) {

    var htmlDocumentHandler = new imatic.view.ajaxify.HTMLDocumentHandler(document, jQuery);

    htmlDocumentHandler.attach();

})(document, jQuery);
