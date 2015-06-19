/// <reference path="Document.ts"/>

/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify {

    "use_strict";

    import HTMLDocumentHandler          = Imatic.View.Ajaxify.Document.HTMLDocumentHandler;
    import ConfigurationBuilder         = Imatic.View.Ajaxify.Configuration.ConfigurationBuilder;
    import ModalConfigurationDefaults   = Imatic.View.Ajaxify.ModalContainer.ModalConfigurationDefaults;
    import ModalConfigurationProcessor  = Imatic.View.Ajaxify.ModalContainer.ModalConfigurationProcessor;
    import RequestHelper                = Imatic.View.Ajaxify.Ajax.RequestHelper;
    import ActionHelper                 = Imatic.View.Ajaxify.Action.ActionHelper;
    import NoAction                     = Imatic.View.Ajaxify.Action.NoAction;
    import ClearAction                  = Imatic.View.Ajaxify.Action.ClearAction;
    import CloseModalAction             = Imatic.View.Ajaxify.ModalContainer.CloseModalAction;

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
        actionHelper.addKeywordHandler('noop', NoAction.keywordHandler);
        actionHelper.addKeywordHandler('clear', ClearAction.keywordHandler);

        // request helper
        requestHelper = new RequestHelper();
    }
}

declare var document: HTMLDocument;

Imatic.View.Ajaxify.init(document);
