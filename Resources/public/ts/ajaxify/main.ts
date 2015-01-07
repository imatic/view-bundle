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
    import ActionHelper                 = imatic.view.ajaxify.action.ActionHelper;
    import RequestHelper                = imatic.view.ajaxify.ajax.RequestHelper;
    import CloseModalAction             = imatic.view.ajaxify.modalContainer.CloseModalAction;

    // global components
    export var domDocument;
    export var documentHandler;
    export var configBuilder;
    export var actionHelper;
    export var requestHelper;

    /**
     * Initialize ajaxify
     */
    export function init(d: HTMLDocument)
    {
        domDocument = d;

        // document handler
        documentHandler = new HTMLDocumentHandler();
        documentHandler.attach();

        // configuration builder
        configBuilder = new ConfigurationBuilder();
        configBuilder.addDefaults(ModalConfigurationDefaults);
        configBuilder.addProcessor(new ModalConfigurationProcessor());

        // action helper
        actionHelper = new ActionHelper();
        actionHelper.addKeywordHandler('close-modal', CloseModalAction.keywordHandler);

        // request helper
        requestHelper = new RequestHelper();
    }
}

declare var document: HTMLDocument;

imatic.view.ajaxify.init(document);
