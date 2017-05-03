import {HTMLDocumentHandler} from './Document';
import {ConfigurationBuilder} from './Configuration';
import {RequestHelper} from './Ajax';
import {ActionHelper, NoAction, ClearAction, ReloadPageAction} from './Action';
import {ModalConfigurationDefaults, ModalConfigurationProcessor, CloseModalAction} from './ModalContainer';

// public components
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
