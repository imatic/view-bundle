/// <reference path="Document.ts"/>
/// <reference path="../jquery/jquery.d.ts"/>

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
    import ReloadPageAction             = Imatic.View.Ajaxify.Action.ReloadPageAction;
    import CloseModalAction             = Imatic.View.Ajaxify.ModalContainer.CloseModalAction;

    export var documentHandler : HTMLDocumentHandler;
    export var configBuilder : ConfigurationBuilder;
    export var actionHelper: ActionHelper;
    export var requestHelper: RequestHelper;

    // document handler
    documentHandler = new HTMLDocumentHandler();
    documentHandler.attach();

    // configuration builder
    configBuilder = new ConfigurationBuilder();
    configBuilder.addDefaults(ModalConfigurationDefaults);
    configBuilder.addProcessor(new ModalConfigurationProcessor());

    // action helper
    actionHelper = new ActionHelper();
    actionHelper.addKeywordHandler('close-modal', CloseModalAction.createKeywordHandler());
    actionHelper.addKeywordHandler('reload-page', ReloadPageAction.createKeywordHandler());
    actionHelper.addKeywordHandler('clear', ClearAction.createKeywordHandler());
    actionHelper.addKeywordHandler('noop', NoAction.createKeywordHandler());

    // request helper
    requestHelper = new RequestHelper();
}
