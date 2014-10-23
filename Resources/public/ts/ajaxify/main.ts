/// <reference path="document.ts"/>

/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify {

    "use_strict";

    import HTMLDocumentHandler          = imatic.view.ajaxify.document.HTMLDocumentHandler;
    import ConfigurationBuilder         = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import ModalConfigurationDefaults   = imatic.view.ajaxify.modalContainer.ModalConfigurationDefaults;
    import ModalConfigurationProcessor  = imatic.view.ajaxify.modalContainer.ModalConfigurationProcessor;

    // global components
    export var domDocument;
    export var documentHandler;
    export var configBuilder;

    /**
     * Initialize ajaxify
     */
    export function init(d: HTMLDocument)
    {
        domDocument = d;

        documentHandler = new HTMLDocumentHandler();
        documentHandler.attach();

        configBuilder = new ConfigurationBuilder();
        configBuilder.addDefaults(ModalConfigurationDefaults);
        configBuilder.addProcessor(new ModalConfigurationProcessor());
    }
}

declare var document: HTMLDocument;

imatic.view.ajaxify.init(document);
